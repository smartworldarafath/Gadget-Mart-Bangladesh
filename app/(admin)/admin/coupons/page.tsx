'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Save, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Coupon } from '@/lib/types'
import { formatPrice } from '@/lib/utils'


export default function AdminCouponsPage() {
  const supabase = createClient()
  
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [form, setForm] = useState({
    code: '',
    discount_type: 'percent',
    discount_value: '',
    min_order_amount: '0',
    expires_at: ''
  })

  const loadCoupons = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setCoupons(data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadCoupons()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('coupons')
        .insert({
          code: form.code.toUpperCase().trim(),
          discount_type: form.discount_type,
          discount_value: parseFloat(form.discount_value) || 0,
          min_order_amount: parseFloat(form.min_order_amount) || 0,
          expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
          is_active: true
        })

      if (error) throw error
      
      setForm({ code: '', discount_type: 'percent', discount_value: '', min_order_amount: '0', expires_at: '' })
      loadCoupons()
    } catch (err: any) {
      alert("Error adding coupon: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Delete this coupon code?")) {
      const { error } = await supabase.from('coupons').delete().eq('id', id)
      if (!error) {
        setCoupons(prev => prev.filter(c => c.id !== id))
      }
    }
  }

  return (
    <div className="space-y-8 select-none text-white">
      <div>
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider">Coupons Management</h1>
        <p className="text-xs text-gray-500 mt-1">Configure and manage shopping discount codes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-3xl p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest pb-3 border-b border-gray-800">Add Coupon</h3>
            
            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                value={form.code}
                onChange={(e) => setForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white font-bold uppercase tracking-wider"
                placeholder="GMB2025"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Discount Type</label>
                <select
                  value={form.discount_type}
                  onChange={(e) => setForm(prev => ({ ...prev, discount_type: e.target.value }))}
                  className="w-full text-xs p-3 bg-gray-850 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
                >
                  <option value="percent">Percent (%)</option>
                  <option value="flat">Flat (৳)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Value *</label>
                <input
                  type="number"
                  required
                  value={form.discount_value}
                  onChange={(e) => setForm(prev => ({ ...prev, discount_value: e.target.value }))}
                  className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Min Order Amount (৳)</label>
              <input
                type="number"
                value={form.min_order_amount}
                onChange={(e) => setForm(prev => ({ ...prev, min_order_amount: e.target.value }))}
                className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Expiry Date</label>
              <input
                type="date"
                value={form.expires_at}
                onChange={(e) => setForm(prev => ({ ...prev, expires_at: e.target.value }))}
                className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
              />
            </div>

            <button type="submit" className="w-full py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer">
              <Plus size={14} /> Create Coupon
            </button>
          </form>
        </div>

        {/* Right Table */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-3xl p-5 md:p-6 space-y-4">
          <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest pb-2 border-b border-gray-800">Active Coupons</h3>
          
          {isLoading && coupons.length === 0 ? (
            <div className="text-center py-16 text-gray-500 flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin text-primary" size={16} /> Load coupons...
            </div>
          ) : coupons.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800 text-xs text-left">
                <thead>
                  <tr className="text-gray-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Discount</th>
                    <th className="py-3 px-4">Min Order</th>
                    <th className="py-3 px-4">Expiry</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-gray-300 font-medium">
                  {coupons.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-950/30">
                      <td className="py-3.5 px-4 font-bold text-primary tracking-wider uppercase">{c.code}</td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {c.discount_type === 'percent' ? `${c.discount_value}%` : formatPrice(c.discount_value)}
                      </td>
                      <td className="py-3.5 px-4">{formatPrice(c.min_order_amount)}</td>
                      <td className="py-3.5 px-4">{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'Never'}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-2 bg-gray-850 hover:bg-rose-950/30 text-gray-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                          aria-label="Delete coupon"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 text-xs">No coupons found.</div>
          )}
        </div>
      </div>
    </div>
  )
}
