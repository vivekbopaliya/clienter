import { db } from "@/lib/db"
import { getDataFromToken } from "@/lib/hooks/getDataFromToken"

export async function POST(req:Request) {
    try {
        const body = await req.json()
        const authUser = await getDataFromToken()

        if(!authUser) {
            return new Response('Unauthorized.', {status: 401})
        }
        
        if(body.folder) {

            await db.file.update({
                where: {
                    id: body.file
                },
                data: {
                    folderId: body.folder,
                    
                }
            })
        }
        else {
            
            await db.file.update({
                where: {
                    id: body.file
                },
                data: {
                    folderId: null,
                    
                }
            })
        }


        return new Response('File has been moved.', {status: 200})
    } catch (error) {
        return new Response('Something went wrong on server side.', {status: 500})
    }
}