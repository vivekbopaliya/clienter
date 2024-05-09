import { deleteImage } from "@/lib/cloudinary/delete"
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
            return new Response("file doesn't exist.", {status: 404})
        }
        const deletefile = await db.file.delete({
            where: {
                id: body.id
            },
        });
        
        await deleteImage(file.public_id!)
        if(!deletefile) {
            return new Response('file could not be deleted.', {status: 500})
        }


        return new Response('file deleted successfully.',  {
            status: 200
        })
    } catch (error:any) {
        console.error("Error deleting file: ", error);
        return new Response(error, {status: 500})
    }
}