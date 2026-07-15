'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, User, Phone, MapPin, Heart, Menu, X, ArrowLeftRight } from 'lucide-react'
import { useCart } from './CartContext'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/lib/types'

export default function Header() {
  const { cart, wishlist } = useCart()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Live search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const delayDebounceFn = setTimeout(async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${searchQuery}%`)
        .limit(6)

      if (!error && data) {
        setSearchResults(data)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setShowSearchDropdown(false)
    }
  }

  return (
    <header className="sticky top-0 w-full z-50 bg-[#141315] text-white shadow-md">
      {/* Top Utility Bar */}
      <div className="hidden lg:block border-b border-gray-800 bg-black/40 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone size={12} className="text-primary" /> Hotline: <strong className="text-white">01977-123456</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={12} /> Outlets: Dhaka, Chittagong
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/track-order" className="hover:text-primary transition-colors">Track Order</Link>
            <Link href="/compare" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeftRight size={12} /> Compare
            </Link>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-4 gap-4">
        {/* Mobile Hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile menu" 
            className="xl:hidden hover:text-primary p-1"
          >
            <Menu size={24} />
          </button>
          
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">GMB</span>
            <span className="hidden md:inline-block font-semibold text-sm tracking-wide border-l border-gray-700 pl-2 text-gray-300">GADGET MART<br />BANGLADESH</span>
          </Link>
        </div>

        {/* Live Search Bar */}
        <div className="relative flex-1 max-w-[500px] hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search product, brand, and more..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowSearchDropdown(true)
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="w-full h-11 bg-gray-800/80 border border-gray-700/80 rounded-full pl-5 pr-12 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            <button 
              type="submit" 
              className="absolute top-1/2 right-2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary hover:bg-primary-hover flex items-center justify-center text-white transition-colors"
            >
              <Search size={16} />
            </button>
          </form>

          {/* Search Dropdown */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-2 border-b border-gray-800 text-xs text-gray-400 px-4">Search Results</div>
              <div className="max-h-[350px] overflow-y-auto">
                {searchResults.map(prod => (
                  <Link 
                    key={prod.id} 
                    href={`/product/${prod.slug}`}
                    onClick={() => setShowSearchDropdown(false)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors border-b border-gray-800/50 last:border-0"
                  >
                    <div className="w-10 h-10 bg-white rounded-lg overflow-hidden p-1 shrink-0">
                      <img
                        src={prod.thumbnail_url || prod.images?.[0] || '/placeholder.jpg'}
                        alt={prod.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{prod.name}</p>
                      <p className="text-xs text-primary font-semibold">৳{prod.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="p-2 bg-gray-950 text-center border-t border-gray-800">
                <button 
                  onClick={handleSearchSubmit} 
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  See all results
                </button>
              </div>
            </div>
          )}

          {/* Click Away to close search */}
          {showSearchDropdown && (
            <div 
              className="fixed inset-0 z-40 bg-transparent" 
              onClick={() => setShowSearchDropdown(false)} 
            />
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-3 lg:gap-5">
          {/* Wishlist Icon */}
          <Link 
            href="/account" 
            className="relative p-2 text-gray-400 hover:text-white transition-colors hover:bg-gray-800/50 rounded-full"
          >
            <Heart size={22} />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold rounded-full size-4.5 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link 
            href="/cart" 
            className="relative p-2.5 bg-gray-800/70 border border-gray-700/50 hover:border-primary hover:text-primary transition-all rounded-full flex items-center justify-center"
          >
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full size-5 flex items-center justify-center border-2 border-[#141315]">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </Link>

          {/* User Sign-in Dashboard Icon */}
          {user?.user_metadata?.full_name ? (
            <Link 
              href="/account"
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 border border-gray-700 rounded-full hover:border-primary hover:text-primary transition-colors text-sm"
            >
              <User size={16} />
              <span className="max-w-[100px] truncate">{user.user_metadata.full_name.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-gray-800/50 rounded-full flex items-center justify-center"
            >
              <User size={22} />
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative flex flex-col w-full max-w-xs bg-gray-900 text-white h-full shadow-2xl z-10 p-5 overflow-y-auto animated slideInLeft">
            <div className="flex justify-between items-center mb-6">
              <span className="text-2xl font-extrabold text-primary">GMB</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 hover:text-primary"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-4 text-lg font-medium">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary p-2 border-b border-gray-800">Home</Link>
              <Link href="/offers" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary p-2 border-b border-gray-800">Offers</Link>
              <Link href="/pre-order" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary p-2 border-b border-gray-800">Pre-order</Link>
              <Link href="/compare" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary p-2 border-b border-gray-800">Compare</Link>
              <Link href="/track-order" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary p-2 border-b border-gray-800">Track Order</Link>
              <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary p-2 border-b border-gray-800">Blog</Link>
              {user ? (
                <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary p-2 border-b border-gray-800">My Account</Link>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary p-2 border-b border-gray-800">Login / Signup</Link>
              )}
            </div>
            
            <div className="mt-auto pt-6 text-gray-500 text-xs">
              <p>Hotline: 01977-123456</p>
              <p className="mt-1">© 2025 Gadget Mart Bangladesh</p>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
