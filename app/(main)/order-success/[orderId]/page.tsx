import React from 'react'
import Link from 'next/link'
import { CheckCircle2, ShoppingBag, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Order, OrderItem } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

interface OrderSuccessPageProps {
  params: Promise<{
    orderId: string
  }>
}

async function getOrderDetails(orderId: string) {
  const supabase = createClient()
  
  let order: Order | null = null
  let items: OrderItem[] = []

  try {
    const { data: orderData } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderData) {
      order = orderData
      
      const { data: itemsData } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId)
        
      if (itemsData) items = itemsData
    }
  } catch (e) {
    console.error("Failed to load order success page details:", e)
  }

  // Fallback order info for testing without database connection
  if (!order) {
    order = {
      id: orderId,
      order_number: 'GMB-99999-ORD',
      customer_id: null,
      customer_name: 'Test Customer',
      customer_phone: '01712345678',
      customer_email: 'test@example.com',
      shipping_address: 'Central Store Road, Jamuna Future Park',
      shipping_city: 'Dhaka',
      shipping_district: 'Dhaka',
      payment_method: 'cash_on_delivery',
      payment_status: 'pending',
      order_status: 'pending',
      subtotal: 1350,
      shipping_charge: 60,
      discount: 0,
      total_amount: 1410,
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    items = [
      {
        id: '1',
        order_id: orderId,
        product_id: null,
        product_name: 'Test QCY T13 TWS Earbuds',
        product_image: null,
        quantity: 1,
        unit_price: 1350,
        total_price: 1350
      }
    ]
  }

  return {
    order,
    items
  }
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderId } = await params
  const { order, items } = await getOrderDetails(orderId)

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-8 select-none">
      {/* Success banner */}
      <div className="space-y-4 animate-in fade-in zoom-in duration-300">
        <div className="flex justify-center text-emerald-500">
          <CheckCircle2 size={64} className="stroke-[1.5]" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-800 uppercase tracking-tight">Order Placed Successfully!</h1>
        <p className="text-xs md:text-sm text-gray-500 max-w-md mx-auto">
          Thank you for shopping at Gadget Mart Bangladesh. Your order is pending verification. Our customer support will contact you shortly.
        </p>
      </div>

      {/* Invoice Details card */}
      <div className="bg-card-bg border border-gray-100 rounded-3xl p-6 text-left space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-gray-150 text-xs md:text-sm font-semibold">
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Order Number</span>
            <span className="text-gray-800 font-extrabold">{order.order_number}</span>
          </div>
          <div className="text-right">
            <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Status</span>
            <span className="text-emerald-600 font-extrabold uppercase bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">
              {order.order_status}
            </span>
          </div>
        </div>

        {/* Order items */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase text-gray-700 tracking-wider">Items Purchased</h4>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs font-semibold">
                <span className="text-gray-600 flex-1 truncate pr-4">
                  {item.product_name} <strong className="text-gray-400">x{item.quantity}</strong>
                </span>
                <span className="text-gray-800 font-bold shrink-0">{formatPrice(item.total_price)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping details */}
        <div className="border-t border-gray-150 pt-5 space-y-2 text-xs md:text-sm font-semibold">
          <h4 className="text-xs font-black uppercase text-gray-700 tracking-wider">Shipping Destination</h4>
          <p className="text-gray-800 font-bold">{order.customer_name} ({order.customer_phone})</p>
          <p className="text-gray-500 leading-tight mt-0.5">{order.shipping_address}, {order.shipping_city}, {order.shipping_district}</p>
        </div>

        {/* Payments Summary */}
        <div className="border-t border-gray-150 pt-5 space-y-3 text-xs md:text-sm font-semibold">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Delivery Charge</span>
            <span>{formatPrice(order.shipping_charge)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-discount-red">
              <span>Discount Applied</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="border-t border-gray-150 pt-3 flex justify-between text-sm font-extrabold">
            <span className="text-gray-800">Total Paid</span>
            <span className="text-primary text-base">{formatPrice(order.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* Action shortcuts */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Link
          href="/"
          className="px-8 py-3.5 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          <ShoppingBag size={16} /> Continue Shopping
        </Link>
      </div>
    </div>
  )
}
