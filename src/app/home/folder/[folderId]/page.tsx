
import DataTable from '@/components/DataTable';
import RollBack from '@/components/RollBack';
import { db } from '@/lib/db';
import React from 'react'

const page = async ({ params }: {
    params: {
        folderId: string;
    }
}) => {


    const folder = await db.folder.findFirst({
        where: {
            id: params.folderId
        },

    })

    const childFolders = await db.folder.findMany({
        where: {
            parentFolderId: folder?.id
        },
        include: {
            User: {
                select: {
                    name: true
                }
            }
        }
    })

    const files = await db.file.findMany({
        where: {
            folderId: folder?.id
        },
        include: {
            User: {
                select: {
                    name: true
                }
            }
        }
    })
    return (
        <div>
            <RollBack title={folder?.name!} />

            <DataTable files={files} folders={childFolders} />
        </div>
    )
}

export default page