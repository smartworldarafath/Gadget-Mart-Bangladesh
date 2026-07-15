'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash2, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Banner } from '@/lib/types'

export default function AdminBannersPage() {
  const supabase = createClient()
  
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [form, setForm] = useState({
    title: '',
    image_url: '',
    link_url: '',
    display_order: '0'
  })

  const loadBanners = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('display_order', { ascending: true })

    if (!error && data) {
      setBanners(data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadBanners()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('banners')
        .insert({
          title: form.title || null,
          image_url: form.image_url,
          link_url: form.link_url || null,
          display_order: parseInt(form.display_order) || 0,
          is_active: true
        })

      if (error) throw error

      setForm({ title: '', image_url: '', link_url: '', display_order: '0' })
      loadBanners()
    } catch (err: any) {
      alert("Error adding banner: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Delete this banner?")) {
      const { error } = await supabase.from('banners').delete().eq('id', id)
      if (!error) {
        setBanners(prev => prev.filter(b => b.id !== id))
      }
    }
  }

  return (
    <div className="space-y-8 select-none text-white">
      <div>
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider">Banners & sliders</h1>
        <p className="text-xs text-gray-500 mt-1">Configure front page promotional sliders and order re-arrangement</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-3xl p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest pb-3 border-b border-gray-800">Add Banner</h3>

            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Banner Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
                placeholder="Holiday Mega Sale"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Image URL *</label>
              <input
                type="text"
                required
                value={form.image_url}
                onChange={(e) => setForm(prev => ({ ...prev, image_url: e.target.value }))}
                className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
                placeholder="https://example.com/banner.jpg"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Redirect link URL</label>
              <input
                type="text"
                value={form.link_url}
                onChange={(e) => setForm(prev => ({ ...prev, link_url: e.target.value }))}
                className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
                placeholder="/category/adapter"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Display Order</label>
              <input
                type="number"
                value={form.display_order}
                onChange={(e) => setForm(prev => ({ ...prev, display_order: e.target.value }))}
                className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
              />
            </div>

            <button type="submit" className="w-full py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer">
              <Plus size={14} /> Add Slider
            </button>
          </form>
        </div>

        {/* Right Table */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-3xl p-5 md:p-6 space-y-4">
          <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest pb-2 border-b border-gray-800">Active Banners</h3>
          
          {isLoading && banners.length === 0 ? (
            <div className="text-center py-16 text-gray-500 flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin text-primary" size={16} /> Load banners...
            </div>
          ) : banners.length > 0 ? (
            <div className="space-y-4">
              {banners.map((b) => (
                <div key={b.id} className="bg-gray-950 border border-gray-800 p-4 rounded-2xl flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-white text-xs uppercase">{b.title || 'Untitled Banner'}</p>
                    <p className="text-[10px] text-gray-500 truncate mt-1">Image: {b.image_url}</p>
                    {b.link_url && <p className="text-[10px] text-primary mt-0.5">Redirect: {b.link_url}</p>}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2 py-0.5 rounded bg-gray-800 text-[10px] font-bold text-gray-400">Order: {b.display_order}</span>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-2 bg-gray-850 hover:bg-rose-950/30 text-gray-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                      aria-label="Delete banner"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 text-xs">No banners configured yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
