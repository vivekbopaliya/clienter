import { db } from "@/lib/db"
import { getDataFromToken } from "@/lib/hooks/getDataFromToken"

export async function POST(req:Request) {
    try {
        const body = await req.json()
        const authUser = await getDataFromToken()


        if(!authUser) {
            return new Response('Unauthorized.', {status: 401})
        }

        const folder = await db.folder.findFirst({
            where: {
                id: body.id
            }
        });
        
        if(!folder) {
            return new Response("Folder doesn't exist.", {status: 404})
        }
        const renameFolder = await db.folder.update({
            where: {
                id: body.id
            },
            data: {
                name: body.newName
            }
        });

        if(!renameFolder) {
            return new Response('Folder could not be renamed.', {status: 500})
        }

        return new Response('Folder renamed successfully.',  {
            status: 200
        })
    } catch (error:any) {
        console.error('Error renaming folder: ', error)
        return new Response(error, {status: 500})
    }
}