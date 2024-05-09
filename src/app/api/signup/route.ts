import { db } from "@/lib/db";
import { UserValidation } from "@/lib/validation/user.validation";
import { ZodError } from "zod";
import bcrypt from 'bcrypt';

export  async function POST(req:Request) {
    try {
        const body = await req.json()
        

        const {name, email, password} = UserValidation.parse(body);

        const alreadyExists = await db.user.findFirst({
            where: {
                email: email
            }
        })

        if(alreadyExists) {
            return new Response('Email is already registered, directly login.', {status: 403})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        if(!hashedPassword) {
            return new Response('Password could not be hashed.', {status: 500})
        }

        const createUser = await db.user.create({
            data: {
                 name, email, password:hashedPassword
            }
        })

        if(!createUser) {
            return new Response('User could not be created, try again.', {status: 500})
        }

        return new Response('User has been created successfully.', {status: 200})
    } catch (error:any) {
        if(error instanceof ZodError) {
            return new Response('Please provid valid data.', {status: 400})
        }
        console.log(error);
        return new Response('Something went wrong on server side.', {status: 500})
    }
}