'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid, Percent, User } from 'lucide-react'

export default function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Category', href: '/category/mobile-phone', icon: Grid },
    { name: 'Offers', href: '/offers', icon: Percent },
    { name: 'Account', href: '/account', icon: User }
  ]

  return (
    <div className="fixed xl:hidden bottom-0 left-0 right-0 bg-white border-t border-gray-150 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-40">
      <div className="grid grid-cols-4 items-center justify-around h-14">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 h-full text-[10px] font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-primary' : 'text-gray-400'} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
