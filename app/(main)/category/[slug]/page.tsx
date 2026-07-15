import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Product, Category } from '@/lib/types'
import CategoryClient from '@/components/CategoryClient'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

async function getCategoryData(slug: string) {
  const supabase = createClient()
  
  let category: Category | null = null
  let products: Product[] = []
  
  try {
    // Get category details
    const { data: catData } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
      
    if (catData) category = catData

    // Get all products in category
    if (category) {
      const { data: prodData } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', category.id)
        .eq('is_active', true)
        
      if (prodData) products = prodData
    }
  } catch (e) {
    console.error("Failed to load category data:", e)
  }

  // Generate fallback category details if not in DB yet
  if (!category) {
    const matchedFallback = {
      'mobile-phone': { name: 'Mobile Phone', id: 'fb-phone' },
      'laptop': { name: 'Laptop', id: 'fb-laptop' },
      'tablet': { name: 'Tablet & Accessories', id: 'fb-tablet' },
      'smart-watch': { name: 'Smart Watch', id: 'fb-watch' },
      'wireless-headphone': { name: 'Wireless Headphone', id: 'fb-headphone' },
      'adapter': { name: 'Adapter', id: 'fb-adapter' }
    }[slug] || { name: 'Tech Products', id: 'fb-generic' }

    category = {
      id: matchedFallback.id,
      name: matchedFallback.name,
      slug: slug,
      icon_url: '🔌',
      image_url: null,
      parent_id: null,
      display_order: 0,
      is_featured: false,
      is_active: true,
      created_at: new Date().toISOString()
    }
  }

  return {
    category,
    products
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category, products } = await getCategoryData(params.slug)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 font-medium">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-600 font-semibold">{category.name}</span>
      </div>

      <CategoryClient 
        category={category} 
        initialProducts={products} 
      />
    </div>
  )
}
