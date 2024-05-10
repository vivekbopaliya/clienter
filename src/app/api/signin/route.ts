import { db } from "@/lib/db";
import { UserValidation } from "@/lib/validators/user.validation";
import { ZodError } from "zod";
import bcrypt from 'bcrypt';
import jwt from 'jwt-simple';
import { cookies } from 'next/headers'
import { setCookie } from "cookies-next";

export  async function POST(req:Request) {
    try {
        const body = await req.json()
        

        const { email, password } = UserValidation.parse(body);

        const user = await db.user.findUnique({
            where: {
                email: email
            }
        })

        if(!user) {
            return new Response('Email is not registered, sign up first.', {status: 403})
        }

        const isValidPassword = await bcrypt.compare(password, user.password)

        if(!isValidPassword) {
            return new Response('Password is incorrect.', {status: 401})
        }

        const payload = {
            id: user.id,
        };
          
        const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET!; 
        
        const token = jwt.encode(payload, secretKey);
        
         cookies().set({
            name: 'token',
            value: token,
            httpOnly: true,
            path: '/',
          })
         
       return new Response('User has been login successfully.', {status: 200})
    } catch (error:any) {
        if(error instanceof ZodError) {
            return new Response('Please provid valid data.', {status: 400})
        }
        console.error('Error signing in: ', error);
        return new Response('Internal server error.', {status: 500})
    }
}