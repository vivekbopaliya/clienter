import { db } from "@/lib/db"
import { getDataFromToken } from "@/lib/hooks/getDataFromToken"

export async function POST(req:Request) {
    try {
        const body = await req.json()
        const authUser = await getDataFromToken()


        if(!authUser) {
            return new Response('Unauthorized.', {status: 401})
        }

        const createFolder = await db.folder.create({
            data: {
                name: body.name,
                // @ts-ignore
                userId: authUser.id!
            }
        })

        if(!createFolder) {
            return new Response('Folder could not be created.', {
                status: 500
            })
        }

        return new Response('Folder created successfully.',  {
            status: 200
        })
    } catch (error:any) {
        return new Response(error, {status: 500})
    }
}