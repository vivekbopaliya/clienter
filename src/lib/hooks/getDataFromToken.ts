import { cookies } from "next/headers";
import * as jose from 'jose'


const jwtConfig = {
    secret: new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET),
  }
  
export const getDataFromToken = async() => {
    try {
        const cookieStore = cookies(); 
        const token = cookieStore.get('token');
           
        const decoded = await jose.jwtVerify(token!.value, jwtConfig.secret)
        return decoded.payload
    } catch (error: any) {
        throw new Error(error.message);
    }

}