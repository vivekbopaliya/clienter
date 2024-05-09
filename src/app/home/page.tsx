import DataTable from '@/components/DataTable'
import { db } from '@/lib/db'
import { getDataFromToken } from '@/lib/hooks/getDataFromToken'
import React from 'react'

const page = async () => {
  const authUser = await getDataFromToken()
  const folders = await db.folder.findMany({
    where: {
      userId: authUser.id!,
      parentFolder: null
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
      userId: authUser.id!,
      Folder: null
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
      <h1 className='text-2xl font-semibold p-2'>Welcome to React file manager!</h1>

     <DataTable folders={folders} files={files}/>
    </div>
  )
}

export default page
