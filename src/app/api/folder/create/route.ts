import { db } from "@/lib/db"
import { getDataFromToken } from "@/lib/hooks/getDataFromToken"

export async function POST(req:Request) {
    try {
        const body = await req.json()
        const authUser:any = await getDataFromToken()

        const parentFolderId = body.folderId


        if(!authUser) {
            return new Response('Unauthorized.', {status: 401})
        }

        if(!parentFolderId) {
            // Create the folder on homepage, if there is no folderId given
           await db.folder.create({
                data: {
                    name: body.name,
                    userId: authUser.id!
                }
            })
        }
        else {
            await db.folder.create({
                data: {
                    name: body.name,
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