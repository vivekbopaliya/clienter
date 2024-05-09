'use client'
import React from 'react'



import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { UserType } from '@/lib/validation/user.validation'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'


type AuthType = 'REGISTER' | 'LOGIN'

const Auth = () => {
    const [auth, setAuth] = React.useState<AuthType>('REGISTER')

    const [name, setName] = React.useState<string>('')
    const [email, setEmail] = React.useState<string>('')
    const [password, setPassword] = React.useState<string>('')

    const route = useRouter()
  

    const toggleAuth = () => {
        if(auth === 'REGISTER') {
            setAuth('LOGIN')
        }else {
            setAuth('REGISTER')
        }
    }

    const {mutate: handleSignUp, isLoading} = useMutation({
        mutationFn: async() => {
            const payload: UserType = {
                name, email, password
            }
            const res = await axios.post('/api/signup', payload);
        }, 
        onError: (error:any) => {
            if(error instanceof AxiosError){
                if(error.response?.status === 403) {
                    return toast.error('This gmail has already been registered, simply login.')
                }
                if(error.response?.status === 400) {
                    return toast.error('Please fill all the fields.')
                }
            }
            toast.error('There was an error on server side, please try again.')
            
        },
        onSuccess: () => {
            toast.success('Your accout has been created, you can simply login now.')
            setAuth('LOGIN')
        }
    })

     const {mutate: handleSignIn, isLoading: SignInLoader} = useMutation({
        mutationFn: async() => {
            const payload: UserType = {
                name, email, password
            }
            const res = await axios.post('/api/signin', payload);
        }, 
        onError: (error:any) => {
            if(error instanceof AxiosError){
                if(error.response?.status === 403) {
                    return toast.error('This Email is not registered, you need to sign up first.')
                }
                if(error.response?.status  === 401) {
                    return toast.error('Password is incorrect.')
                }
                if(error.response?.status === 400) {
                    return toast.error('Please fill all the fields.')
                }
            }
            toast.error('There was an error on server side, please try again.')
            
        },
        onSuccess: () => {
            toast.success('Login successfully.')
            route.push('/home')
        }
    })
    return (
    

    <div>
        <Card className="w-[350px] ">
      <CardHeader>
        <CardTitle >{auth === 'REGISTER' ? 'Sign up' : 'Sign in'}</CardTitle>
        <CardDescription>{auth === 'REGISTER' ? 'Create your account.' : 'Login to your account.'}</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-7">
            {auth ==='REGISTER' && <div className="flex flex-col space-y-3" >
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
            </div>}
            <div className="flex flex-col space-y-3" >
              <Label htmlFor="Email">Email</Label>
              <Input id="email" placeholder="johndoe@gmail.com" type="email"  value={email} onChange={(e) => setEmail(e.target.value)}/>
              
            </div>
            <div className="flex flex-col space-y-3">
              <Label htmlFor="Email">Password</Label>
              <Input id="password" placeholder="********" type="password"  value={password} onChange={(e) => setPassword(e.target.value)}/>
              
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 justify-center w-full">
       {auth === 'REGISTER' && <Button 
        disabled={email === '' || password === ''}
            isLoading={isLoading}
        // @ts-ignore
        onClick={handleSignUp}
        className="w-full">Sign up</Button>}

{auth === 'LOGIN' && <Button 
        disabled={email === '' || password === ''}
            isLoading={SignInLoader}
        // @ts-ignore
        onClick={handleSignIn}
        className="w-full">Sign up</Button>}


<section className='text-sm ' onClick={toggleAuth}  >
        <p>{auth === 'REGISTER' ? 'Already have an account?' : 'Dont have an account?'}<span className='text-blue-500 underline font-medium cursor-pointer'>{' '}{auth === 'REGISTER' ? 'Login here' : 'Create here'}</span></p>
</section>
      </CardFooter>
    </Card>
    </div>
  )
}

export default Auth
