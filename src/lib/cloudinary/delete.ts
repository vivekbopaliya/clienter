// Delete image from cloudinary 

import cloudinary from "./config";

export const deleteImage = async (public_id: string) => {
    try {

        return new Promise(async (resolve, reject) => {
            await cloudinary.uploader.destroy(public_id,
                async (err, result) => {
                    if (err) {
                        return reject(err.message)
                    }
                    return resolve(result)
                }
            )
        })
        

    } catch (error) {
        console.log(error)
    }
}