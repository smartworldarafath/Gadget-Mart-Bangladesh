'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Sparkles, Flame, Headphones, Zap, Gift, RefreshCw } from 'lucide-react'

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const categories = [
    { name: 'Mobile Phone', slug: 'mobile-phone', icon: '📱' },
    { name: 'Laptop', slug: 'laptop', icon: '💻' },
    { name: 'Tablet & Accessories', slug: 'tablet', icon: '📟' },
    { name: 'Smart Watch', slug: 'smart-watch', icon: '⌚' },
    { name: 'Wireless Headphone', slug: 'wireless-headphone', icon: '🎶' },
    { name: 'Speakers', slug: 'speakers', icon: '🔊' },
    { name: 'Adapter', slug: 'adapter', icon: '🔌' },
    { name: 'Cables', slug: 'cable', icon: '🔗' },
    { name: 'Hubs & Docks', slug: 'hubs-and-docks', icon: '🔄' },
    { name: 'Gaming', slug: 'gaming', icon: '🎮' }
  ]

  return (
    <nav className="relative bg-white shadow-sm border-b border-gray-100 hidden xl:block z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-12">
        {/* Navigation Links */}
        <div className="flex items-center gap-1.5 2xl:gap-4 text-[13px] 2xl:text-sm font-semibold text-gray-800">
          <Link href="/" className="hover:text-primary transition-colors py-3.5 border-b-2 border-transparent hover:border-primary">Home</Link>
          
          {/* Categories Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('categories')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 hover:text-primary transition-colors py-3.5 border-b-2 border-transparent hover:border-primary cursor-pointer">
              Categories <ChevronDown size={14} />
            </button>
            
            {activeDropdown === 'categories' && (
              <div className="absolute left-0 w-[240px] bg-white shadow-2xl border border-gray-100 rounded-xl overflow-hidden py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {categories.map((cat) => (
                  <Link 
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-all font-medium"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/category/mobile-phone" className="hover:text-primary transition-colors py-3.5 border-b-2 border-transparent hover:border-primary">Phones</Link>
          <Link href="/category/laptop" className="hover:text-primary transition-colors py-3.5 border-b-2 border-transparent hover:border-primary">Laptops</Link>
          <Link href="/category/tablet" className="hover:text-primary transition-colors py-3.5 border-b-2 border-transparent hover:border-primary">Tablets</Link>
          <Link href="/category/wireless-headphone" className="hover:text-primary transition-colors py-3.5 border-b-2 border-transparent hover:border-primary">Headphones</Link>
          <Link href="/category/adapter" className="hover:text-primary transition-colors py-3.5 border-b-2 border-transparent hover:border-primary">Adapters & Chargers</Link>
        </div>

        {/* Promo and Exclusive Deals shortcuts */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <Link 
            href="/offers" 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-primary border border-orange-100 hover:bg-orange-100 hover:text-primary-hover rounded-full transition-colors"
          >
            <Flame size={12} className="animate-pulse" /> Exclusive Deals
          </Link>
          <Link 
            href="/pre-order" 
            className="flex items-center gap-1.5 text-gray-600 hover:text-primary transition-colors"
          >
            <Sparkles size={12} /> Pre-order
          </Link>
        </div>
      </div>
    </nav>
  )
}
