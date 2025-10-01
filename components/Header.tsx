import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NavItems from '@/components/NavItems'
import UserDropdown from './UserDropdown'

const Header = () => {
  return (
    <header className='sticky top-0 header'>
        <div className='container header-wrapper'>
            <Link href="/">
                <h2 className='h-8 w-auto cursor-pointer font-bold text-emerald-500'>NutriCare</h2>
            </Link>
            <nav className='hidden sm:block'>
                <NavItems />
            </nav>
            <UserDropdown />
        </div>
    </header>
  )
}

export default Header