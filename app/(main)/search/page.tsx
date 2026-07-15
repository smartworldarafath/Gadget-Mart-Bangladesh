import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Product, Category } from '@/lib/types'
import CategoryClient from '@/components/CategoryClient'

interface SearchPageProps {
  searchParams: {
    q?: string
  }
}

async function searchProducts(query: string) {
  const supabase = createClient()
  let products: Product[] = []
  
  try {
    const { data } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${query}%`)
      .eq('is_active', true)
      
    if (data) products = data
  } catch (e) {
    console.error("Search query execution failed:", e)
  }

  return products
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''
  const products = await searchProducts(query)

  const searchCategory: Category = {
    id: 'search-results',
    name: `Search Results: "${query}"`,
    slug: 'search',
    icon_url: '🔍',
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
        <span className="text-gray-600 font-semibold">Search</span>
      </div>

      <CategoryClient 
        category={searchCategory} 
        initialProducts={products} 
      />
    </div>
  )
}
