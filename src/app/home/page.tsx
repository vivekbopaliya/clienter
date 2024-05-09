import DataTable from '@/components/DataTable'
import { db } from '@/lib/db'
import { getDataFromToken } from '@/lib/hooks/getDataFromToken'
import React from 'react'

const page = async () => {
  const authUser = await getDataFromToken()
  const data = await db.folder.findMany({
    where: {
      userId: authUser.id!
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
      <h1 className='text-2xl font-semibold'>Welcome to React file manager!</h1>


     <DataTable data={data}/>
    </div>
  )
}

export default page
