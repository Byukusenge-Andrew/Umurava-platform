"use client"
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { ComponentProps } from 'react'

const Nav = ({ children }: { children: React.ReactNode }) => {
    return (
        <nav className='bg-white flex items-center justify-between font-dm-sans py-3 px-14 fixed top-0 left-0 right-0 z-10'>
            <div className='flex items-center justify-center gap-1 font-bold'>
                <Image
                    src="/favicon-2.png"
                    alt="Umurava logo"
                    width={50}
                    height={5}
                    priority
                />
                <p className='text-base hover:text-primary'>Umurava</p>
            </div>
            <div className='flex items-center justify-between space-x-10'>
                {children}
            </div>
            <Button className='bg-secondary text-white text-xs'>Join the Program</Button>
        </nav>
    )
}

const NavItem = (props: Omit<ComponentProps<typeof Link>, "className">) => {
    const pathName = usePathname();
    return (
        <Link {...props} className={cn('flex items-center text-sm hover:text-primary',
            pathName == props.href && 'text-primary'
        )} />
    )
}

export { Nav, NavItem }