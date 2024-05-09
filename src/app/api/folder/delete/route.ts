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
        const deleteFolder = await db.folder.delete({
            where: {
                id: body.id
            },
        });

        if(!deleteFolder) {
            return new Response('Folder could not be deleted.', {status: 500})
        }

        return new Response('Folder deleted successfully.',  {
            status: 200
        })
    } catch (error:any) {
        return new Response(error, {status: 500})
    }
}