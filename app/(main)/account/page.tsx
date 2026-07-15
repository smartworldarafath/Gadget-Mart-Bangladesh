'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { User, ShoppingBag, Heart, LogOut, ShieldAlert, Check, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Order, OrderItem, WishlistItem } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import ProductCard from '@/components/ProductCard'

type AccountTab = 'profile' | 'orders' | 'wishlist'

export default function AccountPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [activeTab, setActiveTab] = useState<AccountTab>('profile')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Dhaka',
    district: '',
    isAdmin: false
  })
  
  const [orders, setOrders] = useState<(Order & { items: OrderItem[] })[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Verify auth
  useEffect(() => {
    async function loadAccountData() {
      setIsLoading(true)
      const { data: { user: authUser }, error } = await supabase.auth.getUser()
      
      if (error || !authUser) {
        router.push('/login')
        return
      }
      
      setUser(authUser)
      
      // Get profile details
      const { data: customer } = await supabase
        .from('customers')
        .select('*')
        .eq('id', authUser.id)
        .single()
        
      if (customer) {
        setProfile({
          name: customer.full_name || '',
          phone: customer.phone || '',
          email: customer.email || authUser.email || '',
          address: customer.address || '',
          city: customer.city || 'Dhaka',
          district: customer.district || '',
          isAdmin: customer.is_admin || false
        })
      } else {
        // Fallback profile state using metadata
        setProfile(prev => ({
          ...prev,
          name: authUser.user_metadata?.full_name || '',
          phone: authUser.user_metadata?.phone || '',
          email: authUser.email || ''
        }))
      }

      // Load orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('customer_id', authUser.id)
        .order('created_at', { ascending: false })

      if (ordersData) {
        setOrders(
          ordersData.map((ord: any) => ({
            ...ord,
            items: ord.order_items
          }))
        )
      }

      // Load wishlist
      const { data: wishData } = await supabase
        .from('wishlist')
        .select('*, products(*)')
        .eq('customer_id', authUser.id)

      if (wishData) {
        setWishlistItems(
          wishData.map((item: any) => ({
            id: item.id,
            customer_id: item.customer_id,
            product_id: item.product_id,
            created_at: item.created_at,
            product: item.products
          }))
        )
      }

      setIsLoading(false)
    }

    loadAccountData()
  }, [])

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveSuccess(false)
    if (!user) return

    try {
      const { error } = await supabase
        .from('customers')
        .upsert({
          id: user.id,
          full_name: profile.name,
          phone: profile.phone,
          email: profile.email,
          address: profile.address,
          city: profile.city,
          district: profile.district,
          is_admin: profile.isAdmin
        })

      if (error) throw error
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: any) {
      alert(`Failed to save profile: ${err.message || 'Database error.'}`)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 text-gray-400 font-semibold gap-2">
        <RefreshCw className="animate-spin text-primary" size={20} />
        <span>Loading account dashboard...</span>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Side Tab Navigation panel */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-card-bg border border-gray-100 rounded-3xl p-5 md:p-6 space-y-6">
            {/* Short customer details */}
            <div className="text-center space-y-2 pb-4 border-b border-gray-150">
              <div className="size-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary font-black text-xl select-none">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h3 className="font-extrabold text-sm text-gray-800 tracking-tight truncate">{profile.name || 'User Dashboard'}</h3>
              <p className="text-[10px] text-gray-400 font-semibold truncate">{profile.email}</p>
              
              {profile.isAdmin && (
                <Link 
                  href="/admin/dashboard" 
                  className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 border border-rose-100 text-[10px] font-bold text-rose-600 rounded-full hover:bg-rose-100 transition-colors uppercase tracking-wider"
                >
                  <ShieldAlert size={12} /> Admin Panel
                </Link>
              )}
            </div>

            {/* Sidebar Buttons */}
            <div className="flex flex-col gap-2 text-xs font-bold text-gray-600">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full p-3 rounded-xl text-left flex items-center gap-3 transition-colors cursor-pointer ${
                  activeTab === 'profile' ? 'bg-primary/5 text-primary' : 'hover:bg-gray-100/50'
                }`}
              >
                <User size={16} /> Edit Profile
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full p-3 rounded-xl text-left flex items-center gap-3 transition-colors cursor-pointer ${
                  activeTab === 'orders' ? 'bg-primary/5 text-primary' : 'hover:bg-gray-100/50'
                }`}
              >
                <ShoppingBag size={16} /> Order History ({orders.length})
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full p-3 rounded-xl text-left flex items-center gap-3 transition-colors cursor-pointer ${
                  activeTab === 'wishlist' ? 'bg-primary/5 text-primary' : 'hover:bg-gray-100/50'
                }`}
              >
                <Heart size={16} /> Wishlist ({wishlistItems.length})
              </button>

              <button
                onClick={handleSignOut}
                className="w-full p-3 rounded-xl text-left flex items-center gap-3 text-discount-red hover:bg-rose-50 transition-colors cursor-pointer border-t border-gray-150 pt-4"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Right Side Tab details Panel */}
        <main className="lg:col-span-3">
          {/* TAB 1: EDIT PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-[#F8F9FA] border border-gray-100 rounded-3xl p-6 md:p-8 space-y-6">
              <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Edit Profile</h2>

              {saveSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-emerald-800">
                  <Check size={16} className="text-emerald-600" />
                  <span>Profile successfully saved!</span>
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full text-xs p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full text-xs p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">City / Division</label>
                    <select
                      value={profile.city}
                      onChange={(e) => setProfile(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full text-xs p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-medium"
                    >
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Barisal">Barisal</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Mymensingh">Mymensingh</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">District</label>
                    <input
                      type="text"
                      value={profile.district}
                      onChange={(e) => setProfile(prev => ({ ...prev, district: e.target.value }))}
                      className="w-full text-xs p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Delivery Address</label>
                  <textarea
                    rows={3}
                    value={profile.address}
                    onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full text-xs p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-medium"
                  />
                </div>

                <div>
                  <button type="submit" className="px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer">
                    Save Profile
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="bg-[#F8F9FA] border border-gray-100 rounded-3xl p-6 md:p-8 space-y-6">
              <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Your Order History</h2>

              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div 
                      key={order.id} 
                      className="bg-white border border-gray-250/60 rounded-2xl p-4 md:p-5 space-y-4"
                    >
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100 text-xs font-bold">
                        <div>
                          <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Order Number</span>
                          <span className="text-gray-800 font-extrabold">{order.order_number}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Status</span>
                          <span className="text-primary font-extrabold uppercase bg-orange-50 px-2.5 py-0.5 rounded-md text-[10px]">
                            {order.order_status}
                          </span>
                        </div>
                      </div>

                      {/* Items in order */}
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-xs font-semibold text-gray-600">
                            <span className="truncate pr-4">{item.product_name} <strong className="text-gray-400">x{item.quantity}</strong></span>
                            <span className="text-gray-800 font-bold shrink-0">{formatPrice(item.total_price)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Summary total */}
                      <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-xs font-bold text-gray-500">
                        <span>Placed on: {new Date(order.created_at).toLocaleDateString()}</span>
                        <span>Total Paid: <strong className="text-gray-800 text-sm font-black">{formatPrice(order.total_amount)}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-3xl bg-white text-xs text-gray-400">
                  You haven't placed any orders yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="bg-[#F8F9FA] border border-gray-100 rounded-3xl p-6 md:p-8 space-y-6">
              <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Your Wishlist</h2>

              {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlistItems.map((item) => (
                    item.product && <ProductCard key={item.id} product={item.product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-3xl bg-white text-xs text-gray-400">
                  Your wishlist is empty. Explore items and save them to wishlist!
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
