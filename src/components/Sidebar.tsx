'use client'

import React from 'react'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from './ui/input'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'


const Sidebar = () => {

    const [dialog, setDialog] = React.useState<boolean>(false)
    const [folder, setFolder] = React.useState<string>('Untitled Folder')
    const route = useRouter()

    const {mutate: createFolder, isLoading} = useMutation({
        mutationFn: async() => {
            await axios.post('/api/folder/create', {name: folder})
        },
        onError: (error:any) => {
            if(error instanceof AxiosError) {
                if(error.response?.status === 401) {
                    return toast.error('You need to be login to create a folder.')
                }
                if(error.response?.status === 500) {
                    return toast.error('Folder could not be created, please try again.')
                }
            }
        },
        onSuccess: () => {
            route.refresh()
            toast.success(`${folder} created successfully.`)
            setDialog(false)
        }
    })
    return (
        <div className='min-h-full '>
            <Dialog>

                <section>

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button className='flex gap-2 justify-center items-center'  >
                                <p>Add new</p>
                                <Plus className='h-4 w-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel
                            >Create</DropdownMenuLabel>
                            <DropdownMenuItem>

                                <DialogTrigger className='w-full text-left' onClick={() => setDialog(true)}>New Folder</DialogTrigger>

                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem >
                                <label
                                    htmlFor="fileInput"
                                >
                                    New File
                                </label>
                                <input
                                    type="file"
                                    id="fileInput"
                                    className="input-file" // Apply the CSS class for the input
                                />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                            >               <label
                                htmlFor="fileInput"
                            >
                                    New PDF
                                </label>
                                <input
                                    type="file"
                                    id="fileInput"
                                    className="input-file" // Apply the CSS class for the input
                                /></DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>



                </section>

               {dialog === true && <DialogContent className='max-w-sm'>
                    <DialogHeader>
                        <DialogTitle>New Folder</DialogTitle>

                    </DialogHeader>

                    <div>
                        <Input type='text' className='w-full'  value={folder} onChange={(e) => setFolder(e.target.value)} />
                    </div>

                    <DialogFooter>


                        <DialogClose><Button variant={'secondary'}>Cancel</Button></DialogClose>
                        <Button isLoading={isLoading} 
                        // @ts-ignore
                        onClick={createFolder} >Create</Button>

                    </DialogFooter>
                </DialogContent>}
            </Dialog>
        </div>
    )
}

export default Sidebar
