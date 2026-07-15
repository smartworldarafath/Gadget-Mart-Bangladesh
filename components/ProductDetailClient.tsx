'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Heart, Shield, RefreshCw, Truck, Check } from 'lucide-react'
import { Product } from '@/lib/types'
import { useCart } from './CartContext'
import { formatPrice } from '@/lib/utils'
import ProductCard from './ProductCard'

interface ProductDetailClientProps {
  product: Product
  relatedProducts: Product[]
}

type TabType = 'description' | 'specifications' | 'reviews'

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { addToCart, addToWishlist, wishlist, removeFromWishlist } = useCart()
  const router = useRouter()
  
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<TabType>('description')
  const [activeImage, setActiveImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState('Default')
  
  const isDiscounted = product.original_price && product.original_price > product.price
  const discountAmount = isDiscounted ? product.original_price! - product.price : 0
  const discountPercent = isDiscounted ? Math.round((discountAmount / product.original_price!) * 100) : 0

  const inWishlist = wishlist.some(item => item.product_id === product.id)

  const handleAddToCart = async () => {
    await addToCart(product, quantity)
  }

  const handleBuyNow = async () => {
    await addToCart(product, quantity)
    router.push('/checkout')
  }

  const handleWishlistToggle = async () => {
    if (inWishlist) {
      await removeFromWishlist(product.id)
    } else {
      await addToWishlist(product)
    }
  }

  return (
    <div className="space-y-12">
      {/* Upper Grid: Photos + Buy Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
        {/* Left Side: Product Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full bg-white border border-gray-150 rounded-3xl overflow-hidden flex items-center justify-center p-6 select-none group">
            {isDiscounted && (
              <span className="absolute top-4 left-4 bg-discount-red text-white text-[11px] font-extrabold uppercase px-3 py-1.5 rounded-xl shadow-md z-10">
                {discountPercent}% OFF
              </span>
            )}
            
            <img
              src={product.images?.[activeImage] || product.thumbnail_url || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-350"
            />
            
            {/* Overlay Grid lines for tech premium aesthetic */}
            <div className="absolute inset-0 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>

          {/* Thumbnail strip */}
          {product.images && product.images.length > 0 && (
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 bg-white border rounded-xl overflow-hidden p-1 flex items-center justify-center cursor-pointer transition-all ${
                    idx === activeImage ? 'border-primary ring-2 ring-primary/10' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumb ${idx}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Buying details panel */}
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-orange-50 border border-orange-100 px-3 py-1 rounded-full">{product.brand || 'Premium Brand'}</span>
            <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight mt-3">{product.name}</h1>
            <p className="text-xs text-gray-400 mt-1">SKU: {product.sku || 'N/A'}</p>
          </div>

          {/* Pricing Panel */}
          <div className="p-5 bg-card-bg border border-gray-100 rounded-3xl space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl md:text-3xl font-black text-gray-900">{formatPrice(product.price)}</span>
              {isDiscounted && (
                <span className="text-sm text-gray-400 line-through font-semibold">{formatPrice(product.original_price!)}</span>
              )}
            </div>
            {isDiscounted && (
              <p className="text-xs text-discount-red font-bold flex items-center gap-1.5">
                🎉 Save {formatPrice(discountAmount)} ({discountPercent}% OFF)
              </p>
            )}
            <div className="pt-2 text-xs font-semibold flex items-center gap-2">
              <span className="text-gray-500">Stock Status:</span>
              {product.stock_quantity > 0 ? (
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Check size={10} strokeWidth={3} /> In Stock ({product.stock_quantity} remaining)
                </span>
              ) : (
                <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">Out of Stock</span>
              )}
            </div>
          </div>

          {/* Variant Selectors */}
          <div className="space-y-4">
            {/* Color Selector */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-500 tracking-wider">Select Color</label>
              <div className="flex gap-2">
                {['Black', 'White'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all ${
                      selectedColor === color
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-500 tracking-wider">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden w-32 justify-between">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-2 text-gray-500 hover:bg-gray-50 font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-gray-800">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-3 py-2 text-gray-500 hover:bg-gray-50 font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 bg-gray-900 hover:bg-black text-white text-xs md:text-sm font-bold uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs md:text-sm font-bold uppercase tracking-wider rounded-2xl flex items-center justify-center hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-primary/10 cursor-pointer"
            >
              Buy Now
            </button>
          </div>

          {/* Wishlist toggle link */}
          <button
            onClick={handleWishlistToggle}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-primary transition-colors py-1 cursor-pointer"
          >
            <Heart size={16} className={inWishlist ? 'text-primary fill-primary' : ''} />
            <span>{inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
          </button>

          {/* Trust points list */}
          <div className="border-t border-gray-150 pt-5 grid grid-cols-3 gap-4 text-[10px] md:text-xs font-semibold text-gray-500 leading-tight">
            <div className="flex gap-2 items-center">
              <Shield size={16} className="text-primary shrink-0" />
              <span>100% Authentic Product</span>
            </div>
            <div className="flex gap-2 items-center">
              <RefreshCw size={16} className="text-primary shrink-0" />
              <span>Easy Replacement Support</span>
            </div>
            <div className="flex gap-2 items-center">
              <Truck size={16} className="text-primary shrink-0" />
              <span>Fast Home Shipping</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Panel: Description | Specs | Reviews */}
      <div className="border border-gray-150 rounded-3xl bg-[#F8F9FA] overflow-hidden">
        <div className="flex border-b border-gray-150 bg-gray-100/50">
          {(['description', 'specifications', 'reviews'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-xs md:text-sm font-bold uppercase tracking-wider border-r border-gray-150 cursor-pointer ${
                activeTab === tab 
                  ? 'bg-[#F8F9FA] text-primary' 
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/30'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none text-xs md:text-sm text-gray-600 leading-relaxed font-medium">
              <p>{product.description || 'No description available for this product yet.'}</p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(product.specifications || {}).map(([key, val]) => (
                    <tr key={key} className="hover:bg-gray-100/50">
                      <td className="px-6 py-3 font-bold text-gray-500 w-1/3 bg-gray-50">{key}</td>
                      <td className="px-6 py-3 text-gray-700 font-medium">{val}</td>
                    </tr>
                  ))}
                  {Object.keys(product.specifications || {}).length === 0 && (
                    <tr>
                      <td className="px-6 py-3 text-gray-400">No specifications listed.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-700">Customer Reviews</h3>
              <div className="p-6 bg-white border border-gray-200 rounded-2xl text-center text-xs text-gray-400">
                No reviews yet. Be the first to write a review!
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lower Grid: Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight">Related Products</h2>
            <p className="text-xs text-gray-500 mt-1">Customers who viewed this item also bought these</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
