import { cookies } from "next/headers";
import * as jose from 'jose'


const jwtConfig = {
    secret: new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET),
  }
  
  async function getCookieData() {
    const cookieData = cookies().get('token')
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(cookieData)
      }, 1000)
    )
  }

  export const getDataFromToken = async () => {
    try {
        const token:any = await getCookieData(); 
        if (!token) {
            throw new Error('Token not found in cookies');
        }
           
        const decoded = await jose.jwtVerify(token.value!, jwtConfig.secret); 
        return decoded.payload; 
    } catch (error:any) {
        throw new Error(error.message); 
    }
};