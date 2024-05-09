import cloudinary from "./config";

export const uploadImage = async(file:File) => {
    try {
        const buffer = await file.arrayBuffer()
        const bytes = Buffer.from(buffer);


        return new Promise(async (resolve, reject) => {
            await cloudinary.uploader.upload_stream({
                resource_type: 'auto',
                folder: 'filse'
            },
            async (err,result) => {
                    if(err) {
                        return reject(err.message)
                    }
                    return resolve(result)
            }
      ).end(bytes)
        }) 

    } catch (error) {
        console.log(error)
    }
}