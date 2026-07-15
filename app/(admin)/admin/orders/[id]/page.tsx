'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Printer, Shield, Save, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Order, OrderItem } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

export default function AdminOrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  const supabase = createClient()

  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [isFetching, setIsFetching] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // Editable states
  const [orderStatus, setOrderStatus] = useState<string>('pending')
  const [paymentStatus, setPaymentStatus] = useState<string>('pending')

  const loadOrderDetail = async () => {
    setIsFetching(true)
    const { data: orderData, error: orderErr } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (!orderErr && orderData) {
      setOrder(orderData)
      setOrderStatus(orderData.order_status)
      setPaymentStatus(orderData.payment_status)

      const { data: itemsData } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId)

      if (itemsData) setItems(itemsData)
    }
    setIsFetching(false)
  }

  useEffect(() => {
    loadOrderDetail()
  }, [orderId])

  const handleUpdateStatus = async () => {
    setIsSaving(true)
    const { error } = await supabase
      .from('orders')
      .update({
        order_status: orderStatus,
        payment_status: paymentStatus
      })
      .eq('id', orderId)

    setIsSaving(false)
    if (!error) {
      alert("Order details updated successfully!")
      router.refresh()
    } else {
      alert("Failed to update: " + error.message)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (isFetching) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 text-gray-500 font-semibold gap-2">
        <RefreshCw className="animate-spin text-primary" size={20} />
        <span>Loading order details...</span>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-24 text-gray-400 font-bold space-y-4">
        <p>Order not found or database connection error.</p>
        <Link href="/admin/orders" className="text-primary hover:underline">Back to Orders</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 select-none text-white print:text-black print:bg-white print:p-0">
      {/* Upper header - Hidden during print */}
      <div className="flex items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="p-2 bg-gray-900 border border-gray-800 text-gray-400 hover:text-white rounded-xl transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider">Manage Order</h1>
            <p className="text-xs text-gray-500 mt-1">Order Ref: {order.order_number}</p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-2"
        >
          <Printer size={14} /> Print Invoice
        </button>
      </div>

      {/* Invoice Page - Optimized for both Web and PDF Printing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Printable Invoice Card */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 print:border-0 rounded-3xl p-6 md:p-8 space-y-8 print:bg-white print:text-black print:p-0">
          
          {/* Invoice Header */}
          <div className="flex justify-between items-start pb-6 border-b border-gray-800 print:border-gray-200">
            <div>
              <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent print:text-primary print:from-primary print:to-primary">GMB</span>
              <p className="text-[10px] uppercase font-bold text-gray-500 print:text-gray-400 mt-1">Gadget Mart Bangladesh</p>
              <p className="text-[9px] text-gray-500 leading-tight">Jamuna Future Park, Dhaka, BD</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-black tracking-tight text-white print:text-black">INVOICE RECEIPT</h2>
              <p className="text-[10px] text-gray-400 mt-1">No: {order.order_number}</p>
              <p className="text-[10px] text-gray-400">Date: {new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Billing Contact details */}
          <div className="grid grid-cols-2 gap-6 text-xs md:text-sm font-semibold">
            <div>
              <h4 className="text-gray-500 uppercase text-[10px] tracking-wider mb-1.5 font-bold">Billing Contact</h4>
              <p className="text-white print:text-black font-bold">{order.customer_name}</p>
              <p className="text-gray-400 print:text-gray-600 mt-0.5">{order.customer_phone}</p>
              {order.customer_email && <p className="text-gray-400 print:text-gray-600">{order.customer_email}</p>}
            </div>
            <div>
              <h4 className="text-gray-500 uppercase text-[10px] tracking-wider mb-1.5 font-bold">Delivery Destination</h4>
              <p className="text-white print:text-black leading-tight">{order.shipping_address}</p>
              <p className="text-gray-400 print:text-gray-600 mt-1">{order.shipping_city}, {order.shipping_district}</p>
            </div>
          </div>

          {/* Items listing table */}
          <div className="space-y-4 pt-4">
            <h4 className="text-xs font-black uppercase text-gray-400 print:text-gray-600 tracking-wider">Purchase Items</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs text-left">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-800 print:border-gray-200 pb-2 font-bold uppercase tracking-wider">
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-center w-16">Qty</th>
                    <th className="py-2 text-right w-24">Unit Price</th>
                    <th className="py-2 text-right w-24">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-850 print:divide-gray-150 font-medium text-gray-300 print:text-black">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 font-bold">{item.product_name}</td>
                      <td className="py-3 text-center">{item.quantity}</td>
                      <td className="py-3 text-right">{formatPrice(item.unit_price)}</td>
                      <td className="py-3 text-right font-bold">{formatPrice(item.total_price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Summary */}
          <div className="border-t border-gray-800 print:border-gray-200 pt-6 flex justify-end">
            <div className="w-64 space-y-2.5 text-xs md:text-sm font-semibold text-gray-400 print:text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white print:text-black font-bold">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="text-white print:text-black font-bold">{formatPrice(order.shipping_charge)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-discount-red">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="border-t border-gray-800 print:border-gray-200 pt-2.5 flex justify-between text-sm font-extrabold text-white print:text-black">
                <span>Total Paid</span>
                <span className="text-primary print:text-primary text-base font-black">{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column sidebar: Order Control Settings (Hidden in Print) */}
        <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-3xl p-5 md:p-6 space-y-6 print:hidden">
          <h3 className="text-xs font-black uppercase text-white tracking-widest pb-3 border-b border-gray-800 flex items-center gap-1.5">
            <Shield size={14} className="text-primary" /> Management
          </h3>

          {/* Order Status Select */}
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Order Status</label>
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="w-full text-xs p-3 bg-gray-850 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white appearance-none"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>
          </div>

          {/* Payment Status Select */}
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Payment Status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full text-xs p-3 bg-gray-850 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white appearance-none"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div className="pt-2 border-t border-gray-800">
            <button
              onClick={handleUpdateStatus}
              disabled={isSaving}
              className="w-full py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-lg shadow-primary/10"
            >
              {isSaving ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />} Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
