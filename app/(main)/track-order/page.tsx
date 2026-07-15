'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, ShoppingBag, CheckCircle, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Order } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

export default function TrackOrderPage() {
  const supabase = createClient()
  const [orderNumber, setOrderNumber] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setOrder(null)
    setIsLoading(true)

    if (!orderNumber.trim()) return

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber.trim().toUpperCase())
        .single()

      if (error || !data) {
        throw new Error('Order not found. Check the order number and try again.')
      }

      setOrder(data)
    } catch (err: any) {
      setError(err.message || 'Database error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8 select-none">
      <div className="text-center space-y-2">
        <div className="flex justify-center text-primary">
          <ShoppingBag size={48} className="stroke-[1.5]" />
        </div>
        <h1 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight">Track Your Order</h1>
        <p className="text-xs text-gray-400">Enter your GMB Order Reference number to check shipping status</p>
      </div>

      <form onSubmit={handleTrack} className="flex gap-2">
        <input
          type="text"
          required
          placeholder="GMB-XXXXXX-ORD"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
          className="flex-1 text-xs p-3 bg-card-bg border border-gray-200 rounded-xl focus:outline-none focus:border-primary uppercase font-bold tracking-wider"
        />
        <button 
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
        >
          {isLoading ? <RefreshCw className="animate-spin" size={14} /> : <Search size={14} />} Track
        </button>
      </form>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-center text-xs font-semibold text-rose-800">
          {error}
        </div>
      )}

      {order && (
        <div className="bg-[#F8F9FA] border border-gray-100 rounded-3xl p-5 md:p-6 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300 text-xs md:text-sm font-semibold">
          <div className="flex justify-between items-center pb-3 border-b border-gray-150">
            <div>
              <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Order Reference</span>
              <span className="text-gray-800 font-extrabold">{order.order_number}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Current Status</span>
              <span className="text-primary font-extrabold uppercase bg-orange-50 px-2.5 py-0.5 rounded-md text-[10px]">
                {order.order_status}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-gray-500">
              <span>Customer Name</span>
              <span className="text-gray-800">{order.customer_name}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Payment Mode</span>
              <span className="text-gray-800 uppercase text-[10px]">{order.payment_method.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Payment Status</span>
              <span className="text-gray-850 uppercase text-[10px]">{order.payment_status}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Total Price</span>
              <span className="text-primary font-extrabold">{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
