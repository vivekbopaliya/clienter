import { db } from "@/lib/db"
import { getDataFromToken } from "@/lib/hooks/getDataFromToken"

export async function POST(req:Request) {
    try {
        const body = await req.json()
        const authUser = await getDataFromToken()

        const parentFolderId = body.folderId


        if(!authUser) {
            return new Response('Unauthorized.', {status: 401})
        }

        if(!parentFolderId) {
           await db.folder.create({
                data: {
                    name: body.name,
                    // @ts-ignore
                    userId: authUser.id!
                }
            })
        }
        else {
            await db.folder.create({
                data: {
                    name: body.name,
                    // @ts-ignore
                    userId: authUser.id!,
                    parentFolderId: parentFolderId
                }
            })
        }

        return new Response('Folder created successfully.',  {
            status: 200
        })
    } catch (error:any) {
        console.error('Error creating folder: ', error)
        return new Response(error, {status: 500})
    }
}