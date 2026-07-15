'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, ShoppingCart, Eye, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Order } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

type FilterStatus = 'all' | 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export default function AdminOrdersPage() {
  const supabase = createClient()
  
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [isLoading, setIsLoading] = useState(true)

  const loadOrders = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        setOrders(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const filteredOrders = orders.filter(ord => {
    const matchesSearch = 
      ord.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer_phone.includes(searchQuery)

    const matchesStatus = statusFilter === 'all' ? true : ord.order_status === statusFilter

    return matchesSearch && matchesStatus
  })

  const statuses: FilterStatus[] = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

  return (
    <div className="space-y-8 select-none text-white">
      <div>
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider">Order Management</h1>
        <p className="text-xs text-gray-500 mt-1">Review orders details, print receipts and manage delivery status</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5 md:p-6 space-y-6">
        {/* Controls bar */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full max-w-sm">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Search by order #, customer name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
            />
          </div>

          {/* Status Tabs filters */}
          <div className="flex flex-wrap gap-1.5 bg-gray-950 p-1.5 rounded-2xl border border-gray-800 max-w-full overflow-x-auto no-scrollbar">
            {statuses.map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                  statusFilter === st ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-500 flex items-center justify-center gap-2">
            <RefreshCw className="animate-spin text-primary" size={16} /> Loading orders data...
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800 text-xs text-left">
              <thead>
                <tr className="text-gray-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300 font-medium">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-950/30">
                    <td className="py-3.5 px-4 font-bold text-white">{ord.order_number}</td>
                    <td className="py-3.5 px-4">{new Date(ord.created_at).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4">{ord.customer_name}</td>
                    <td className="py-3.5 px-4 text-gray-400">{ord.customer_phone}</td>
                    <td className="py-3.5 px-4">
                      <span className="uppercase text-[9px] font-bold">
                        {ord.payment_method.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">{formatPrice(ord.total_amount)}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded text-[9px] font-bold uppercase bg-primary/10 text-primary">
                        {ord.order_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="p-2 bg-gray-850 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors inline-block"
                        aria-label="View order"
                      >
                        <Eye size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-gray-850 rounded-2xl text-xs text-gray-500">
            No orders found matching criteria.
          </div>
        )}
      </div>
    </div>
  )
}
