"use client"

import Link from 'next/link'
import React from 'react'
import NavItems from '@/components/NavItems'
import UserDropdown from './UserDropdown'
import { useSession } from 'next-auth/react'
import { Button } from './ui/button'

const Header = () => {
  const { data: session, status } = useSession();
  return (
    <header className='sticky top-0 header'>
        <div className='container header-wrapper'>
            <Link href="/">
                <h2 className='h-8 w-auto cursor-pointer font-bold text-emerald-500'>NutriCare</h2>
            </Link>
            <nav className='hidden sm:block'>
                <NavItems />
            </nav>

            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
            ) : session?.user ? (
              <UserDropdown />
            ) : (
              <Link href="/auth/signin">
                <Button className="bg-emerald-500/20 hover:bg-gray-500/20 text-emerald-400 border-emerald-500 cursor-pointer">
                  Login
                </Button>
              </Link>
            )}
        </div>
    </header>
  )
}

export default Header