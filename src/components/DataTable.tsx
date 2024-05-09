'use client'

import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from './ui/input';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface DataTableProps {
    User: {
        name: string;
    } | null;
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string | null;
}

type dialogStateType = 'RENAME' | 'DELETE' | ''
const DataTable = ({ data }: { data: DataTableProps[] }) => {

    const formatDate = (dateString: Date) => {
        const options: any = { day: "numeric", month: "long", year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", options);
    };

    const [dialogState, setDialogState] = React.useState<dialogStateType>('')
    const [focusedData, setFocusedData] = React.useState<DataTableProps | null>(null)

    const [dialog, setDialog] = React.useState(false)
    const [rename, setRename] = React.useState('')

    const router = useRouter()

    const { mutate: handleRename, isLoading: renameLoading } = useMutation({
        mutationFn: async () => {
            const payload = {
                id: focusedData?.id, newName: rename
            }
            await axios.post('/api/folder/rename', payload)
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    return toast.error('You need to be login to do that.')
                }
                if (error.response?.status === 404) {
                    return toast.error('The folder you are trying to rename is no longer access.')
                }
            }
        },
        onSuccess: () => {
            toast.success('Folder renamed successfully.')
            router.refresh()
            setDialog(false)
        }
    })


    const { mutate: handleDelete, isLoading: deleteLoading } = useMutation({
        mutationFn: async () => {
            const payload = {
                id: focusedData?.id,
            }
            await axios.post('/api/folder/delete', payload)
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    return toast.error('You need to be login to do that.')
                }
                if (error.response?.status === 404) {
                    return toast.error('The folder does not exist.')
                }
            }
        },
        onSuccess: () => {
            toast.success('Folder deleted successfully.')
            router.refresh()
            setDialog(false)
        }
    })


    return (
        <div>

            <section>
                <Dialog>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead className="hidden sm:table-cell">Owner</TableHead>
                                <TableHead>Last modified</TableHead>
                                <TableHead>File size</TableHead>
                                <TableHead></TableHead>

                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.map((data) => (
                                <TableRow key={data.id} >
                                    <TableCell className='cursor-pointer'>
                                        <Link href={`/home/${data.id}`}>
                                            {data.name}
                                        </Link>

                                    </TableCell>

                                    <TableCell className=" sm:table-cell font-normal">
                                        {data.User?.name}
                                    </TableCell>
                                    <TableCell className=" font-normal table-cell  ">
                                        {formatDate(data.updatedAt)}
                                    </TableCell>
                                    <TableCell className="table-cell">
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>

                                            <DropdownMenuTrigger>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>


                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>{data.name}</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    <DialogTrigger className='w-full text-left' onClick={
                                                        () => {
                                                            setDialogState('RENAME')
                                                            setFocusedData(data)
                                                            setDialog(true)

                                                        }

                                                    } >Rename</DialogTrigger>

                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <DialogTrigger className='w-full text-left' onClick={
                                                        () => {
                                                            setDialogState('DELETE')
                                                            setFocusedData(data)
                                                            setDialog(true)
                                                        }

                                                    }>Delete</DialogTrigger>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                   { dialog === true && <DialogContent className='max-w-sm'>
                        <DialogHeader>
                            <DialogTitle>{dialogState} {focusedData?.name}</DialogTitle>
                            {dialogState === 'DELETE' && <DialogDescription>Are you surely want to delete?</DialogDescription>}
                        </DialogHeader>

                        {dialogState === 'RENAME' && <div>
                            <Input type='text' className='w-full' value={rename} onChange={(e) => setRename(e.target.value)} />
                        </div>
                        }
                        <DialogFooter>


                            <DialogClose><Button variant={'secondary'}>Cancel</Button></DialogClose>
                            {dialogState === 'RENAME' && <Button
                                onClick={() => {
                                    handleRename()
                                }} isLoading={renameLoading}
                            >Rename</Button>}
                            {dialogState === 'DELETE' && <Button onClick={() => {
                                handleDelete()
                            }} isLoading={deleteLoading}
                            >Delete</Button>
                            }                  </DialogFooter>
                    </DialogContent>}
                </Dialog>
            </section>
        </div>
    )
}

export default DataTable
