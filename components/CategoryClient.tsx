'use client'

import React, { useState, useMemo } from 'react'
import { Filter, SlidersHorizontal, ChevronDown, Check } from 'lucide-react'
import ProductCard from './ProductCard'
import { Product, Category } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

interface CategoryClientProps {
  category: Category
  initialProducts: Product[]
}

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'newest'

export default function CategoryClient({ category, initialProducts }: CategoryClientProps) {
  // Extract unique brands dynamically
  const uniqueBrands = useMemo(() => {
    const brands = initialProducts.map(p => p.brand).filter(Boolean) as string[]
    return [...new Set(brands)].sort()
  }, [initialProducts])

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 20000 })
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('relevance')

  // Toggle brand selection
  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts]

    // Brand Filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => p.brand && selectedBrands.includes(p.brand))
    }

    // Price Filter
    result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max)

    // Stock Filter
    if (inStockOnly) {
      result = result.filter(p => p.stock_quantity > 0)
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    return result
  }, [initialProducts, selectedBrands, priceRange, inStockOnly, sortBy])

  const clearAllFilters = () => {
    setSelectedBrands([])
    setPriceRange({ min: 0, max: 20000 })
    setInStockOnly(false)
    setSortBy('relevance')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Filters */}
      <aside className="lg:col-span-1 space-y-6">
        <div className="bg-card-bg border border-gray-100 rounded-3xl p-5 md:p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-150">
            <span className="font-extrabold text-sm text-gray-800 uppercase flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-primary" /> Filters
            </span>
            <button 
              onClick={clearAllFilters}
              className="text-xs text-primary font-bold hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* Price Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-gray-700 tracking-wider">Price Range</h4>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Min (৳)</label>
                <input 
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                  className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Max (৳)</label>
                <input 
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Brands Filter */}
          {uniqueBrands.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-gray-700 tracking-wider">Brands</h4>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                {uniqueBrands.map(brand => (
                  <button
                    key={brand}
                    onClick={() => handleBrandChange(brand)}
                    className="flex items-center justify-between w-full text-left py-1 text-xs text-gray-600 hover:text-primary transition-colors cursor-pointer"
                  >
                    <span className="font-medium">{brand}</span>
                    <div className={`size-4.5 rounded-md border flex items-center justify-center transition-colors ${
                      selectedBrands.includes(brand) ? 'bg-primary border-primary text-white' : 'border-gray-300 bg-white'
                    }`}>
                      {selectedBrands.includes(brand) && <Check size={10} strokeWidth={3} />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Availability Filter */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black uppercase text-gray-700 tracking-wider">Availability</h4>
            <button
              onClick={() => setInStockOnly(prev => !prev)}
              className="flex items-center justify-between w-full text-left py-1 text-xs text-gray-600 hover:text-primary transition-colors cursor-pointer"
            >
              <span className="font-medium">In Stock Only</span>
              <div className={`size-4.5 rounded-md border flex items-center justify-center transition-colors ${
                inStockOnly ? 'bg-primary border-primary text-white' : 'border-gray-300 bg-white'
              }`}>
                {inStockOnly && <Check size={10} strokeWidth={3} />}
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Product Grid and Top Bar */}
      <main className="lg:col-span-3 space-y-6">
        {/* Category Header Bar */}
        <div className="bg-card-bg border border-gray-100 rounded-3xl p-4 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight">{category.name}</h1>
            <p className="text-xs text-gray-500 mt-1">{filteredProducts.length} items matching criteria</p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <label className="text-xs font-bold text-gray-500 uppercase">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-xs font-semibold p-2.5 pr-8 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary appearance-none relative"
            >
              <option value="relevance">Default Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Arrival</option>
            </select>
          </div>
        </div>

        {/* Product Listing */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
            <span className="text-5xl">🔍</span>
            <h3 className="mt-4 text-base font-black text-gray-700">No Products Found</h3>
            <p className="mt-1.5 text-xs text-gray-400 max-w-sm mx-auto">
              We couldn't find any products in {category.name} matching your active filters. Try resetting the filters or adjusting the price range.
            </p>
            <button 
              onClick={clearAllFilters}
              className="mt-6 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase rounded-full shadow-md shadow-primary/10 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
