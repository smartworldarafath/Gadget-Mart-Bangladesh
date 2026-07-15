'use client'

import React, { useState } from 'react'
import { Save, Check } from 'lucide-react'

export default function AdminSettingsPage() {
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    siteName: 'Gadget Mart Bangladesh',
    tagline: 'Premium Tech & Accessories Store',
    phone: '01977-123456',
    email: 'support@gadgetmartbd.com',
    chargeDhaka: '60',
    chargeOutside: '120',
    bkashMerchant: '01977-123456'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-white select-none">
      <div>
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider">Store Settings</h1>
        <p className="text-xs text-gray-500 mt-1">Configure global e-commerce contact settings and shipping charges</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
        {success && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-900/50 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-emerald-300">
            <Check size={16} className="text-emerald-500" />
            <span>Store settings saved successfully!</span>
          </div>
        )}

        <h3 className="text-sm font-black uppercase text-white tracking-widest pb-3 border-b border-gray-800">General Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Site Title</label>
            <input
              type="text"
              value={form.siteName}
              onChange={(e) => setForm(prev => ({ ...prev, siteName: e.target.value }))}
              className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm(prev => ({ ...prev, tagline: e.target.value }))}
              className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
            />
          </div>
        </div>

        <h3 className="text-sm font-black uppercase text-white tracking-widest pb-3 border-b border-gray-800 pt-2">Contact & Wallet Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Support Hotline</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Support Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
              className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">bKash Merchant Wallet</label>
            <input
              type="text"
              value={form.bkashMerchant}
              onChange={(e) => setForm(prev => ({ ...prev, bkashMerchant: e.target.value }))}
              className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white font-bold tracking-wide"
            />
          </div>
        </div>

        <h3 className="text-sm font-black uppercase text-white tracking-widest pb-3 border-b border-gray-800 pt-2">Shipping Charges (BDT ৳)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Delivery Charge: Inside Dhaka (৳)</label>
            <input
              type="number"
              value={form.chargeDhaka}
              onChange={(e) => setForm(prev => ({ ...prev, chargeDhaka: e.target.value }))}
              className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white font-bold"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Delivery Charge: Outside Dhaka (৳)</label>
            <input
              type="number"
              value={form.chargeOutside}
              onChange={(e) => setForm(prev => ({ ...prev, chargeOutside: e.target.value }))}
              className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white font-bold"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-800">
          <button type="submit" className="px-8 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-primary/10">
            <Save size={14} /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  )
}
