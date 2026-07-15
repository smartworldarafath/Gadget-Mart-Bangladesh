import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Product, Category } from '@/lib/types'
import CategoryClient from '@/components/CategoryClient'

async function getDiscountedProducts() {
  const supabase = createClient()
  let products: Product[] = []
  
  try {
    const { data } = await supabase
      .from('products')
      .select('*')
      .gt('discount_percent', 0)
      .eq('is_active', true)
      
    if (data) products = data
  } catch (e) {
    console.error("Failed to load offers:", e)
  }

  return products
}

export default async function OffersPage() {
  const products = await getDiscountedProducts()

  const offersCategory: Category = {
    id: 'gmb-offers',
    name: 'Exclusive Offers & Discounts',
    slug: 'offers',
    icon_url: '🔥',
    image_url: null,
    parent_id: null,
    display_order: 0,
    is_featured: false,
    is_active: true,
    created_at: new Date().toISOString()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 font-medium">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-600 font-semibold">Special Offers</span>
      </div>

      {/* Banner design */}
      <div className="mb-6 h-[120px] md:h-[180px] bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 rounded-3xl p-6 md:p-10 flex flex-col justify-center text-white">
        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full w-max select-none">Save Big in Taka</span>
        <h1 className="text-xl md:text-3xl font-black mt-2 tracking-tight">SPECIAL DISCOUNTED DEALS</h1>
        <p className="text-xs text-orange-50/90 mt-1 max-w-md">Browse all Gadget Mart Bangladesh products currently selling below retail price.</p>
      </div>

      <CategoryClient 
        category={offersCategory} 
        initialProducts={products} 
      />
    </div>
  )
}
