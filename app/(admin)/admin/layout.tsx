'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, FolderTree, ShoppingCart, Users, Ticket, Image, Settings, LogOut, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [adminName, setAdminName] = useState('Administrator')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setAdminName(data.user.user_metadata?.full_name || 'Administrator')
      }
    })
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  // If we are on the login page, don't show the sidebar!
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
    { name: 'Banners', href: '/admin/banners', icon: Image },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen flex bg-gray-950 text-gray-300">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-gray-800 bg-gray-900 flex flex-col justify-between shrink-0 select-none">
        <div className="p-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2 mb-8">
            <ShieldCheck className="text-primary size-7" />
            <span className="text-xl font-extrabold text-white tracking-tight">GMB Admin</span>
          </Link>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer Admin log */}
        <div className="p-4 border-t border-gray-800 flex items-center justify-between gap-3 text-xs bg-black/20">
          <div className="min-w-0">
            <p className="font-bold text-white truncate">{adminName}</p>
            <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Control Access</p>
          </div>
          <button
            onClick={handleSignOut}
            className="p-2 text-gray-400 hover:text-discount-red hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Logout admin"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-950 p-6 md:p-8">
        {children}
      </main>
    </div>
  )
}
