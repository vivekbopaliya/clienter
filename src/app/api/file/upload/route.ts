import { uploadImage } from "@/lib/cloudinary/upload"
import { db } from "@/lib/db"
import { bytesToKilobytes } from "@/lib/helpers/bytesToKB"
import { getDataFromToken } from "@/lib/hooks/getDataFromToken"

export async function POST(req: Request) {
    try {
        const authUser = await getDataFromToken()

        if (!authUser) {
            return new Response('Unauthorized.', { status: 401 })
        }

        const formData = await req.formData()

        const file: any = formData.get('file')
        const folderId = formData.get('folderId')

        const KBFormat = bytesToKilobytes(file.size)

        if (!file) {
            return new Response('Please provide a file.', { status: 400 })
        }

        const cloudinary: any = await uploadImage(file)


        if (!folderId) {
            await db.file.create({
                data: {
                    name: file.name,
                    size: KBFormat,
                    url: cloudinary.secure_url,
                    public_id: cloudinary.public_id,
                    // @ts-ignore
                    userId: authUser.id
                }
            })

        }
        else {
            await db.file.create({
                data: {
                    name: file.name,
                    size: KBFormat,
                    url: cloudinary.secure_url,
                    public_id: cloudinary.public_id,
                    // @ts-ignore
                    userId: authUser.id,
                    // @ts-ignore
                    folderId: folderId
                }
            })

        }

        return new Response('File has been uploaded successfully.', { status: 200 })
    } catch (error: any) {
        console.error('Error uploading file: ', error)
        return new Response(error, { status: 500 })
    }
}