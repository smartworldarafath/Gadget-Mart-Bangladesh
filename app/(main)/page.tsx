import React from 'react'
import Link from 'next/link'
import HeroSlider from '@/components/HeroSlider'
import TrustBadges from '@/components/TrustBadges'
import ProductCard from '@/components/ProductCard'
import { createClient } from '@/lib/supabase/server'
import { Product, Category } from '@/lib/types'
import HomeTabs from '@/components/HomeTabs'

// Fallback categories if database table doesn't exist yet
const fallbackCategories: Category[] = [
  { id: '1', name: 'Mobile Phone', slug: 'mobile-phone', icon_url: '📱', image_url: null, parent_id: null, display_order: 1, is_featured: true, is_active: true, created_at: '' },
  { id: '2', name: 'Laptop', slug: 'laptop', icon_url: '💻', image_url: null, parent_id: null, display_order: 2, is_featured: true, is_active: true, created_at: '' },
  { id: '3', name: 'Tablet', slug: 'tablet', icon_url: '📟', image_url: null, parent_id: null, display_order: 3, is_featured: true, is_active: true, created_at: '' },
  { id: '4', name: 'Smart Watch', slug: 'smart-watch', icon_url: '⌚', image_url: null, parent_id: null, display_order: 4, is_featured: true, is_active: true, created_at: '' },
  { id: '5', name: 'Wireless Headphone', slug: 'wireless-headphone', icon_url: '🎶', image_url: null, parent_id: null, display_order: 5, is_featured: true, is_active: true, created_at: '' },
  { id: '6', name: 'Speakers', slug: 'speakers', icon_url: '🔊', image_url: null, parent_id: null, display_order: 6, is_featured: true, is_active: true, created_at: '' },
  { id: '7', name: 'Adapter', slug: 'adapter', icon_url: '🔌', image_url: null, parent_id: null, display_order: 7, is_featured: true, is_active: true, created_at: '' },
  { id: '8', name: 'Cables', slug: 'cable', icon_url: '🔗', image_url: null, parent_id: null, display_order: 8, is_featured: true, is_active: true, created_at: '' }
]

async function getData() {
  const supabase = createClient()
  
  let categories: Category[] = []
  let exclusiveDeals: Product[] = []
  let bestDeals: Product[] = []
  let topSelling: Product[] = []
  let newArrivals: Product[] = []

  try {
    const { data: catData } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    
    if (catData) categories = catData

    const { data: exclData } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('is_exclusive_deal', true)
      .limit(8)
    
    if (exclData) exclusiveDeals = exclData

    const { data: bdData } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('is_best_deal', true)
      .limit(8)
    
    if (bdData) bestDeals = bdData

    const { data: tsData } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('is_top_selling', true)
      .limit(8)
    
    if (tsData) topSelling = tsData

    const { data: naData } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('is_new_arrival', true)
      .limit(8)
    
    if (naData) newArrivals = naData

  } catch (e) {
    console.error("Supabase data fetch failed, using fallback empty states:", e)
  }

  return {
    categories: categories.length > 0 ? categories : fallbackCategories,
    exclusiveDeals,
    bestDeals,
    topSelling,
    newArrivals
  }
}

export default async function HomePage() {
  const { categories, exclusiveDeals, bestDeals, topSelling, newArrivals } = await getData()

  return (
    <div className="space-y-6 md:space-y-10 pb-12">
      {/* Hero Banner Slider */}
      <HeroSlider />

      {/* Ribbon Trust Badges */}
      <TrustBadges />

      {/* Sub-Banner Grid */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          href="/category/wireless-headphone" 
          className="relative block h-[140px] md:h-[180px] rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-950 hover:shadow-lg transition-shadow group"
        >
          <div className="absolute inset-0 p-6 flex flex-col justify-center space-y-1 z-20">
            <span className="text-[10px] uppercase font-bold tracking-widest text-primary">Limited Combo</span>
            <h3 className="text-xl md:text-2xl font-black text-white">QCY Earbuds Special</h3>
            <p className="text-xs text-gray-300">Premium active noise cancelling audio gear under ৳2,000.</p>
            <span className="inline-block pt-2 text-xs font-semibold text-primary group-hover:underline">Shop Collection →</span>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-white/5 skew-x-12 transform origin-top-right transition-transform group-hover:scale-105" />
        </Link>

        <Link 
          href="/category/adapter" 
          className="relative block h-[140px] md:h-[180px] rounded-3xl overflow-hidden bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg transition-shadow group"
        >
          <div className="absolute inset-0 p-6 flex flex-col justify-center space-y-1 z-20">
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/90">Fast Charging</span>
            <h3 className="text-xl md:text-2xl font-black text-white">GaN Chargers Fest</h3>
            <p className="text-xs text-orange-100">Power up your workspace with multi-port high power adapters.</p>
            <span className="inline-block pt-2 text-xs font-semibold text-white group-hover:underline">Browse Adapters →</span>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-black/10 -skew-x-12 transform origin-top-right transition-transform group-hover:scale-105" />
        </Link>
      </div>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-gray-800 uppercase">Featured Categories</h2>
            <p className="text-xs text-gray-500 mt-1">Get your favorite gadgets by category</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <Link 
              key={cat.slug} 
              href={`/category/${cat.slug}`}
              className="bg-card-bg border border-gray-100 hover:border-primary/20 hover:bg-white hover:shadow-md rounded-2xl p-4 text-center flex flex-col items-center justify-center gap-2.5 transition-all group"
            >
              <span className="text-3xl select-none group-hover:scale-110 transition-transform duration-300">
                {cat.icon_url || '🔌'}
              </span>
              <span className="text-xs font-bold text-gray-700 group-hover:text-primary transition-colors leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Exclusive Deals (Horizontal Scroll) */}
      {exclusiveDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-gray-800 uppercase">Exclusive Deals</h2>
              <p className="text-xs text-gray-500 mt-1">Handpicked hot offers just for you</p>
            </div>
            <Link href="/offers" className="text-xs text-primary font-bold hover:underline">See All</Link>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 snap-x">
            {exclusiveDeals.map((prod) => (
              <div key={prod.id} className="w-[180px] md:w-[240px] shrink-0 snap-start">
                <ProductCard product={prod} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products Tabbed Section */}
      <section className="max-w-7xl mx-auto px-4">
        <HomeTabs 
          bestDeals={bestDeals}
          topSelling={topSelling}
          newArrivals={newArrivals}
        />
      </section>
    </div>
  )
}
