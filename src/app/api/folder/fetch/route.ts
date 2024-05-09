import { db } from "@/lib/db";
import { getDataFromToken } from "@/lib/hooks/getDataFromToken";

export async function GET(req:Request) {
    try {
        const authUser = await getDataFromToken()

        if(!authUser) {
            return new Response('Unauthorized.', {status: 401})
        }
        const folders = await db.folder.findMany({
            where: {
                userId: authUser.id!
            }
        })

        const foldersJson = JSON.stringify(folders);
        return new Response(foldersJson, { status: 200 })
    } catch (error:any) {
        console.error('Error fetching all folder: ', error)
        return new Response(error, {status: 500})
    }
}