'use client'

import React from 'react'
import Link from 'next/link'
import { ShoppingCart, Heart } from 'lucide-react'
import { Product } from '@/lib/types'
import { useCart } from './CartContext'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, addToWishlist, wishlist, removeFromWishlist } = useCart()

  const isDiscounted = product.original_price && product.original_price > product.price
  const discountPercent = isDiscounted
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0

  const inWishlist = wishlist.some(item => item.product_id === product.id)

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inWishlist) {
      await removeFromWishlist(product.id)
    } else {
      await addToWishlist(product)
    }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await addToCart(product, 1)
  }

  return (
    <div className="group card-3d-tilt relative bg-[#F8F9FA] border border-gray-100 rounded-2xl p-3 md:p-4 flex flex-col justify-between transition-all duration-350 ease-out">
      {/* Product Image & Badges */}
      <Link href={`/product/${product.slug}`} className="block card-3d-tilt-inner relative w-full aspect-square bg-white rounded-xl overflow-hidden p-2">
        {/* Discount Badge */}
        {isDiscounted && (
          <span className="absolute top-2 left-2 bg-discount-red text-white text-[10px] font-extrabold uppercase px-2 py-1 rounded-lg z-10 shadow-sm animate-pulse">
            {discountPercent}% OFF
          </span>
        )}

        {/* Hot / Featured tags */}
        {product.is_exclusive_deal && (
          <span className="absolute top-2 right-2 bg-primary text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md z-10">
            Exclusive
          </span>
        )}

        {/* Product Image */}
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden select-none bg-white rounded-lg">
          <img
            src={product.thumbnail_url || product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Subtle zoom on hover */}
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-[10px] text-primary font-bold uppercase tracking-wider bg-white px-3 py-1.5 rounded-full shadow-md scale-90 group-hover:scale-100 transition-transform duration-300">Quick View</span>
          </div>
        </div>
      </Link>

      {/* Wishlist toggle */}
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-18 right-6 p-2 rounded-full bg-white/80 backdrop-blur shadow-sm hover:scale-110 active:scale-95 transition-all z-20 ${
          inWishlist ? 'text-primary' : 'text-gray-400 hover:text-primary'
        }`}
        aria-label="Toggle Wishlist"
      >
        <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
      </button>

      {/* Product Info */}
      <div className="mt-3 md:mt-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{product.brand || 'Generic'}</span>
          <Link href={`/product/${product.slug}`} className="block mt-1">
            <h3 className="text-xs md:text-sm font-bold text-gray-800 line-clamp-2 hover:text-primary transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          {/* Pricing */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm md:text-base font-extrabold text-gray-900 leading-none">
                {formatPrice(product.price)}
              </span>
              {isDiscounted && (
                <span className="text-[10px] md:text-xs text-gray-400 line-through font-medium">
                  {formatPrice(product.original_price!)}
                </span>
              )}
            </div>
          </div>

          {/* Quick Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="p-2 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-md shadow-primary/10 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
            aria-label="Add to cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
