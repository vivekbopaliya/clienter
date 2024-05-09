import { FolderInput, Plus } from 'lucide-react';
import React from 'react'
import { Button } from './ui/button';


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


const MoveFiles = ({ folders }: { folders: FolderDataTableProps[] }) => {
    return (
        <div>
            {folders.map((folder) => {
                return <div className='flex w-full  '>

                    <Button variant={'outline'} className='flex gap-2 w-full justify-start text-start'>
                        <FolderInput className='w-4 h-4' />
                        <p>{folder.name}</p>

                    </Button>

                </div>
            })}
        </div>
    )
}

export default MoveFiles
