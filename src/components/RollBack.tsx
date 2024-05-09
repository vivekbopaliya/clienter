'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'
import { ChevronLeft } from 'lucide-react'

const RollBack = ({ title }: { title: string }) => {

    const route = useRouter()
    return (
        <div className='flex gap-2 justify-start items-center'>
            <Button variant={'outline'} onClick={() => route.back()}>
                <ChevronLeft className='w-6 h-6' />
            </Button>
            <h1 className='p-2 text-2xl font-semibold'>{title}</h1>
        </div>
    )
}

export default RollBack
