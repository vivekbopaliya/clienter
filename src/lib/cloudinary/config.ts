import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dclwviexj',
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!
});

export default cloudinary;
