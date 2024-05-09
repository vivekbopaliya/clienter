import { db } from "@/lib/db"
import { getDataFromToken } from "@/lib/hooks/getDataFromToken"

export async function POST(req:Request) {
    try {
        const body = await req.json()
        const authUser = await getDataFromToken()


        if(!authUser) {
            return new Response('Unauthorized.', {status: 401})
        }

        const file = await db.file.findFirst({
            where: {
                id: body.id
            }
        });
        
        if(!file) {
            return new Response("Folder doesn't exist.", {status: 404})
        }
        const renameFile = await db.file.update({
            where: {
                id: body.id
            },
            data: {
                name: body.newName
            }
        });

        if(!renameFile) {
            return new Response('Folder could not be renamed.', {status: 500})
        }

        return new Response('File renamed successfully.',  {
            status: 200
        })
    } catch (error:any) {
        return new Response(error, {status: 500})
    }
}