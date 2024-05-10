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
import { File, Folder, FolderInput, Loader2, MoreHorizontal } from 'lucide-react';
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
import { formatDate } from '@/lib/helpers/formatData';
import { isFolderData } from '@/lib/helpers/isFolderData';

interface FolderDataTableProps {
    User: {
        name: string;
    } | null;
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string | null;
    parentFolderId?: string | null;
}



interface FileDataTableProps {
    User: {
        name: string;
    } | null;
    id: string;
    name: string;
    url: string;
    size: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string | null;
    folderId: string | null;
}

type dialogStateType = 'RENAME' | 'DELETE' | 'MOVE' | ''


const DataTable = ({ folders, files }: { folders?: FolderDataTableProps[], files?: FileDataTableProps[] }) => {

    // To open and close dialog box
    const [dialog, setDialog] = React.useState(false)

    // To determine which dropdown option is clicked
    const [dialogState, setDialogState] = React.useState<dialogStateType>('')
    
    // Keeping track of data for the currently opened dialog box.
    const [focusedData, setFocusedData] = React.useState<FolderDataTableProps | FileDataTableProps | null>(null)

    const [allFolders, setAllFolders] = React.useState<FolderDataTableProps[] | []>([])

    const [rename, setRename] = React.useState('')

    const router = useRouter()


    // Get all folders data for moving files
    const { mutate: getAllFolders, isLoading: FoldersLoading } = useMutation({
        mutationFn: async () => {
            const res = await axios.get('/api/folder/fetch')
            setAllFolders(res.data)
        }
    })

    // Rename folder or file
    const { mutate: handleRename, isLoading: renameLoading } = useMutation({
        mutationFn: async () => {
            const payload = {
                id: focusedData?.id, newName: rename
            }

            if (isFolderData(focusedData)) {
                await axios.post('/api/folder/rename', payload)
            }
            else {
                await axios.post('/api/file/rename', payload)
            }

        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    return toast.error('You need to be login to do that.')
                }
                if (error.response?.status === 404) {
                    return toast.error(`The ${focusedData?.name} you are trying to rename is no longer exist.`)
                }
            }
        },
        onSuccess: () => {
            toast.success(`${focusedData?.name} renamed successfully.`)
            router.refresh()
            setRename('New Folder')
            setDialog(false)
        }
    })


    // Move file to diffrent folders
    const { mutate: handleMoveFiles } = useMutation(
        async (folderId?: string | '') => {
            const payload = {
                file: focusedData?.id,
                folder: folderId
            };
            await axios.post('/api/file/move', payload);
        },
        {
            onError: (error) => {
                if (error instanceof AxiosError) {
                    if (error.response?.status === 401) {
                        toast.error('You need to login to do that.');
                    }
                }
            },
            onSuccess: () => {
                router.refresh();
                toast.success('File moved successfully.');
                setDialog(false)
            }
        }
    );


    // delete folder or file
    const { mutate: handleDelete, isLoading: deleteLoading } = useMutation({
        mutationFn: async () => {
            const payload = {
                id: focusedData?.id,
            }
            if (isFolderData(focusedData)) {
                await axios.post('/api/folder/delete', payload)
            }
            else {
                await axios.post('/api/file/delete', payload)
            }
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    return toast.error('You need to be login to do that.')
                }
                if (error.response?.status === 404) {
                    return toast.error(`The ${focusedData?.name} does not exist.`)
                }
            }
        },
        onSuccess: () => {
            toast.success(`${focusedData?.name} deleted successfully.`)
            router.refresh()
            setDialog(false)
        }
    })

    return (
        <div className='p-2'>
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

                            {/* Folder array */}
                            {folders?.map((data) => (
                                <TableRow key={data.id} >
                                    <TableCell className='cursor-pointer'>
                                        <Link href={`/home/folder/${data.id}`} className=' flex gap-2  items-center text-start'>
                                            <Folder className='h-5 w-5' />
                                            {data.name}
                                        </Link>

                                    </TableCell>

                                    <TableCell className=" sm:table-cell hidden font-normal">
                                        {data.User?.name}
                                    </TableCell>
                                    <TableCell className=" font-normal table-cell  ">
                                        {formatDate(data.updatedAt)}
                                    </TableCell>
                                    <TableCell className="table-cell">
                                        ---
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


                            {/* File array */}
                            {files?.map((data) => (
                                <TableRow key={data.id} >
                                    <TableCell className='cursor-pointer'>
                                        <a href={data.url} className='flex gap-2 text-start items-center'>
                                            <File className='h-5 w-5' />
                                            {data.name}
                                        </a>
                                    </TableCell>
                                    <TableCell className=" sm:table-cell hidden font-normal">
                                        {data.User?.name}
                                    </TableCell>
                                    <TableCell className=" font-normal table-cell  ">
                                        {formatDate(data.updatedAt)}
                                    </TableCell>
                                    <TableCell className="table-cell">
                                        {data.size}

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
                                                    <DialogTrigger className='w-full text-left' onClick={() => {
                                                        setDialogState('RENAME');
                                                        setDialog(true);
                                                        setFocusedData(data)
                                                    }}>Rename</DialogTrigger>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <DialogTrigger className='w-full text-left' onClick={
                                                        () => {
                                                            setDialogState('MOVE')
                                                            setFocusedData(data)
                                                            setDialog(true)
                                                            getAllFolders()
                                                        }

                                                    } >Move</DialogTrigger>

                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <DialogTrigger className='w-full text-left' onClick={() => {
                                                        setDialogState('DELETE');
                                                        setDialog(true);
                                                        setFocusedData(data)
                                                    }}>Delete</DialogTrigger>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {dialog === true && <DialogContent className='max-w-sm'>
                        <DialogHeader>
                            <DialogTitle>{dialogState} {focusedData?.name}</DialogTitle>
                            {dialogState === 'DELETE' && <DialogDescription>Are you surely want to delete?</DialogDescription>}
                        </DialogHeader>

                        {dialogState === 'RENAME' && <div>
                            <Input type='text' className='w-full' value={rename} onChange={(e) => setRename(e.target.value)} />
                        </div>
                        }
                        {dialogState === 'MOVE' && (
                            <div className='grid grid-cols-2'>
                                {!FoldersLoading && <Button variant={'outline'} className='w-full' onClick={() => handleMoveFiles('')}>
                                    Move to home
                                </Button>}
                                {FoldersLoading && <Loader2 className='animate-spin h-6 w-6' />}
                                {allFolders?.map((folder: any) => (
                                    <div className='flex w-full justify-start ' key={folder.id}>
                                        <Button variant={'outline'} className='flex gap-2 w-full justify-start text-start' onClick={() => handleMoveFiles(folder?.id)}>
                                            <FolderInput className='w-4 h-4' />
                                            <p>{folder.name!}</p>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

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

                {(folders?.length === 0 && files?.length === 0) && <h2 className='p-5 flex justify-center items-center'>There is no file or folder here.</h2>}


            </section>
        </div>
    )
}

export default DataTable
