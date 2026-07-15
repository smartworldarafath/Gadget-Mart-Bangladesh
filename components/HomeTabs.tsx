'use client'

import React, { useState } from 'react'
import ProductCard from './ProductCard'
import { Product } from '@/lib/types'

interface HomeTabsProps {
  bestDeals: Product[]
  topSelling: Product[]
  newArrivals: Product[]
}

type TabType = 'best' | 'top' | 'new'

export default function HomeTabs({ bestDeals, topSelling, newArrivals }: HomeTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('best')

  const tabs = [
    { key: 'best', label: 'Best Deals', count: bestDeals.length, data: bestDeals },
    { key: 'top', label: 'Top Selling', count: topSelling.length, data: topSelling },
    { key: 'new', label: 'New Arrivals', count: newArrivals.length, data: newArrivals }
  ]

  const activeData = tabs.find(t => t.key === activeTab)?.data || []

  return (
    <div className="space-y-6">
      {/* Tab Navigation header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-150 pb-3">
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-gray-800 uppercase">Featured Products</h2>
          <p className="text-xs text-gray-500 mt-1">Explore our most popular and newly arrived tech gadgets</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              className={`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {activeData.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {activeData.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50">
          <span className="text-4xl">📦</span>
          <h3 className="mt-4 text-sm font-bold text-gray-700">No Products Found</h3>
          <p className="mt-1 text-xs text-gray-400 max-w-xs mx-auto">
            Once you seed the database with the 70 products from the catalog, they will appear right here!
          </p>
        </div>
      )}
    </div>
  )
}
