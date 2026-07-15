'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { useCart } from '@/components/CartContext'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartSubtotal, getCartTotal, discount, coupon, applyCoupon, removeCoupon } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState(false)

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    setCouponError('')
    setCouponSuccess(false)
    
    if (!couponCode.trim()) return

    const success = await applyCoupon(couponCode.trim())
    if (success) {
      setCouponSuccess(true)
    } else {
      setCouponError('Invalid coupon code or minimum order amount not met.')
    }
  }

  const subtotal = getCartSubtotal()
  const total = getCartTotal()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight mb-8 uppercase flex items-center gap-3">
        <ShoppingBag className="text-primary" /> Shopping Cart
      </h1>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items list */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div 
                key={item.product_id}
                className="bg-[#F8F9FA] border border-gray-100 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                {/* Product details */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-16 h-16 bg-white border rounded-xl flex items-center justify-center shrink-0 text-[10px] font-bold text-gray-400 select-none">
                    GMB
                  </div>
                  <div className="min-w-0">
                    <Link href={`/product/${item.product?.slug}`} className="text-sm font-bold text-gray-800 hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {item.product?.name}
                    </Link>
                    <p className="text-xs text-primary font-semibold mt-1">{formatPrice(item.product?.price || 0)}</p>
                  </div>
                </div>

                {/* Adjust quantities & totals */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden w-28 justify-between shrink-0">
                    <button 
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-gray-800">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-sm font-extrabold text-gray-800 w-20 text-right">
                    {formatPrice((item.product?.price || 0) * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.product_id)}
                    className="text-gray-400 hover:text-discount-red p-1.5 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card-bg border border-gray-100 rounded-3xl p-5 md:p-6 space-y-6 shadow-sm">
              <h3 className="text-sm font-black uppercase text-gray-800 tracking-wider pb-3 border-b border-gray-150">Order Summary</h3>
              
              {/* Calculations */}
              <div className="space-y-3 text-xs md:text-sm font-semibold">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-800 font-bold">{formatPrice(subtotal)}</span>
                </div>

                {coupon && (
                  <div className="flex justify-between text-discount-red">
                    <span>Discount ({coupon.code})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-150 pt-3 flex justify-between text-sm font-extrabold">
                  <span className="text-gray-800">Total Amount</span>
                  <span className="text-primary text-base">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Coupon Form */}
              <div className="border-t border-gray-150 pt-5">
                {coupon ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between text-xs font-semibold text-emerald-800">
                    <span>Applied: <strong>{coupon.code}</strong></span>
                    <button 
                      onClick={removeCoupon}
                      className="text-[10px] text-discount-red font-bold uppercase tracking-wider hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Have a Coupon?</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="COUPON CODE"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 text-xs p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary uppercase font-bold tracking-wider"
                      />
                      <button 
                        type="submit"
                        className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-[10px] text-discount-red font-bold">{couponError}</p>}
                    {couponSuccess && <p className="text-[10px] text-emerald-600 font-bold">Coupon successfully applied!</p>}
                  </form>
                )}
              </div>

              {/* Proceed */}
              <div className="pt-2">
                <Link
                  href="/checkout"
                  className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white text-xs md:text-sm font-bold uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/10 transition-colors"
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-24 border-2 border-dashed border-gray-150 rounded-3xl bg-[#F8F9FA]/40 max-w-2xl mx-auto space-y-4">
          <span className="text-5xl">🛒</span>
          <h2 className="text-lg font-black text-gray-700">Your Cart is Empty</h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            You haven't added any products to your cart yet. Browse our exclusive collection of adapters, earbuds, and chargers!
          </p>
          <div>
            <Link 
              href="/"
              className="inline-block px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md shadow-primary/10 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
