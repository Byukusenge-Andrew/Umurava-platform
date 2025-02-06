import { Bell, Search } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

function Nav() {
    return (
        <div className='bg-white flex justify-between items-center sticky top-0 py-3 px-8'>
            <div className="bg-gray-50 shadow-sm h-fit w-1/2 flex items-center p-1 pl-3 space-x-2 rounded-md">
                <Search className='h-4 w-4 text-gray-400' />
                <input className="bg-gray-50 h-6 w-full outline-none ring-0 focus:ring-0 focus:outline-none text-xs" type="text" name="text" id="text" placeholder="Search here" />
            </div>
            <div className='flex items-center gap-2'>
                <div className='bg-gray-100 hover:bg-gray-200 flex justify-center items-center cursor-pointer rounded-full w-fit p-2'>
                    <Bell className='text-gray-600 h-5 w-5' />
                </div>
                <Image className="bg-gray-800 hover:bg-gray-700 cursor-pointer w-9 h-9 rounded-full object-cover" src="/image-6.png" alt="profile" height={100} width={100} />
            </div>
        </div>
    )
}

export default Nav