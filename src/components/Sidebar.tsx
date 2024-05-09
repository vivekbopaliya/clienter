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
import { usePathname, useRouter } from 'next/navigation'

type DialogStateTypes = 'Folder' | 'File' | ''

const Sidebar = () => {

    const [dialog, setDialog] = React.useState<boolean>(false)
    const [dialogState, setDialogState] = React.useState<DialogStateTypes>('')
    const [folder, setFolder] = React.useState<string>('Untitled Folder')
    const [file, setFile] = React.useState<File | null>(null)

    const route = useRouter()
    
    const pathname = usePathname()

    // folder id for sub folders
    let folderId = pathname.split('/').pop();

    if (folderId === 'home') {
        folderId = ''
    }
    
    
    // file selection
    const handleFileChange = (e: any) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0])
        }

    }


    // Upload file
    const { mutate: handleFileUpload, isLoading: fileLoading } = useMutation({
        mutationFn: async () => {
            const formData = new FormData()

            formData.append('file', file!)
            if (folderId !== '') {
                formData.append('folderId', folderId!)
            }

            await axios.post('/api/file/upload', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

        }, onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    route.push('/')
                    return toast.error('You need to be login to do that.')

                }
                if (error.response?.status === 400) {
                    return toast.error('Please provide a valid file.')
                }
                return toast.error('File could not be uploaded, please try again.')
            }
        }, onSuccess: () => {
            toast.success('File uploaded successfully.')
            route.refresh()
            setDialog(false)
        }
    })


    // Create folder
    const { mutate: createFolder, isLoading } = useMutation({
        mutationFn: async () => {
            const payload = {
                name: folder,
                folderId: folderId
            }
            await axios.post('/api/folder/create', payload)
        },
        onError: (error: any) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    return toast.error('You need to be login to create a folder.')
                }
                if (error.response?.status === 500) {
                    return toast.error('Folder could not be created, please try again.')
                }
            }
        },
        onSuccess: () => {
            route.refresh()
            toast.success(`${folder} created successfully.`)
            setFile(null)
            setDialog(false)
        }
    })

    const handleSignOut = () => {
        route.push('/')

    }
    return (
        <div className='sm:min-h-screen min-h-fit sm:w-fit w-screen flex sm:flex-col  sm:justify-start justify-between  sm:items-start items-center   sm:px-0 px-5'>
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

                                <DialogTrigger className='w-full text-left' onClick={() => {
                                    setDialog(true)
                                    setDialogState('Folder')
                                }}>New Folder</DialogTrigger>

                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <DialogTrigger className='w-full text-left' onClick={() => {
                                    setDialog(true)
                                    setDialogState('File')
                                }}>New File</DialogTrigger>
                            </DropdownMenuItem>


                        </DropdownMenuContent>
                    </DropdownMenu>



                </section>

                {dialog === true && <DialogContent className='max-w-sm'>
                    <DialogHeader>
                        <DialogTitle>New {dialogState === 'File' ? 'File' : 'Folder'}</DialogTitle>

                    </DialogHeader>

                    {dialogState === 'Folder' && <div>
                        <Input type='text' className='w-full' value={folder} onChange={(e) => setFolder(e.target.value)} />
                    </div>}

                    {dialogState === 'File' &&
                        <div className="flex flex-col items-center  space-y-8">
                            <label
                                htmlFor="fileInput"
                                className="cursor-pointer bg-gray-200 mt-5 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
                            >
                                Choose a File
                            </label>
                            <input
                                type="file"
                                id="fileInput"
                                className="hidden"
                                onChange={(e) => handleFileChange(e)}
                            />
                            <div className="flex items-center justify-center w-full">
                                <span
                                    className={`w-full bg-white border ${file !== null ? "border-green-400 " : "border-gray-300"
                                        } px-4 py-2 rounded-md text-gray-800`}
                                >
                                    <span id="fileName" className="truncate">
                                        {file !== null ? file?.name : ""}
                                    </span>
                                </span>
                            </div>
                        </div>

                    }

                    {dialogState === 'Folder' && <DialogFooter>


                        <DialogClose><Button variant={'secondary'}>Cancel</Button></DialogClose>
                        <Button isLoading={isLoading}
                            // @ts-ignore
                            onClick={createFolder} >Create</Button>

                    </DialogFooter>}


                    {dialogState === 'File' &&
                        <DialogFooter>
                            <Button disabled={file === null}
                                // @ts-ignore
                                onClick={handleFileUpload}
                                isLoading={fileLoading}

                            >
                                Submit
                            </Button>
                        </DialogFooter>
                    }
                </DialogContent>}
            </Dialog>

            <Button className='my-3' variant={'destructive'} 
            onClick={handleSignOut}>Sign out</Button>
        </div>
    )
}

export default Sidebar
