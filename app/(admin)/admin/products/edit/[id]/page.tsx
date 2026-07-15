'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Plus, Trash2, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Category } from '@/lib/types'

export default function AdminEditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const supabase = createClient()
  
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  
  const [form, setForm] = useState({
    name: '',
    category_id: '',
    brand: '',
    model: '',
    price: '',
    original_price: '',
    stock_quantity: '20',
    sku: '',
    short_description: '',
    description: '',
    is_featured: false,
    is_exclusive_deal: false,
    is_best_deal: false,
    is_top_selling: false,
    is_new_arrival: false,
    is_active: true
  })

  // Dynamic specs builder
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([])

  useEffect(() => {
    async function loadFormDetails() {
      setIsFetching(true)
      
      const { data: catData } = await supabase.from('categories').select('*')
      if (catData) setCategories(catData)

      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (!error && product) {
        setForm({
          name: product.name || '',
          category_id: product.category_id || '',
          brand: product.brand || '',
          model: product.model || '',
          price: product.price?.toString() || '',
          original_price: product.original_price?.toString() || '',
          stock_quantity: product.stock_quantity?.toString() || '0',
          sku: product.sku || '',
          short_description: product.short_description || '',
          description: product.description || '',
          is_featured: product.is_featured || false,
          is_exclusive_deal: product.is_exclusive_deal || false,
          is_best_deal: product.is_best_deal || false,
          is_top_selling: product.is_top_selling || false,
          is_new_arrival: product.is_new_arrival || false,
          is_active: product.is_active || false
        })

        // Map specifications JSON to array
        const listSpecs: { key: string; value: string }[] = []
        Object.entries(product.specifications || {}).forEach(([key, val]) => {
          listSpecs.push({ key, value: String(val) })
        })
        setSpecs(listSpecs)
      }
      setIsFetching(false)
    }

    loadFormDetails()
  }, [productId])

  const handleAddSpecRow = () => {
    setSpecs(prev => [...prev, { key: '', value: '' }])
  }

  const handleRemoveSpecRow = (idx: number) => {
    setSpecs(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSpecChange = (idx: number, field: 'key' | 'value', val: string) => {
    setSpecs(prev =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const specifications: Record<string, string> = {}
    specs.forEach(item => {
      if (item.key.trim() && item.value.trim()) {
        specifications[item.key.trim()] = item.value.trim()
      }
    })

    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: form.name,
          slug: slug,
          brand: form.brand || 'Generic',
          model: form.model || form.name,
          price: parseFloat(form.price) || 0,
          original_price: form.original_price ? parseFloat(form.original_price) : null,
          category_id: form.category_id || null,
          stock_quantity: parseInt(form.stock_quantity) || 0,
          sku: form.sku || null,
          short_description: form.short_description,
          description: form.description,
          specifications: specifications,
          is_featured: form.is_featured,
          is_exclusive_deal: form.is_exclusive_deal,
          is_best_deal: form.is_best_deal,
          is_top_selling: form.is_top_selling,
          is_new_arrival: form.is_new_arrival,
          is_active: form.is_active
        })
        .eq('id', productId)

      if (error) throw error

      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      alert("Error updates product: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 text-gray-500 font-semibold gap-2">
        <RefreshCw className="animate-spin text-primary" size={20} />
        <span>Loading product details...</span>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-white select-none">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="p-2 bg-gray-900 border border-gray-800 text-gray-400 hover:text-white rounded-xl transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider">Edit Product</h1>
          <p className="text-xs text-gray-500 mt-1">Modify product details, inventory parameters, and specifications</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
        {/* Core fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Product Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Category *</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm(prev => ({ ...prev, category_id: e.target.value }))}
              className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white appearance-none"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Brand</label>
            <input
              type="text"
              value={form.brand}
              onChange={(e) => setForm(prev => ({ ...prev, brand: e.target.value }))}
              className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Model</label>
            <input
              type="text"
              value={form.model}
              onChange={(e) => setForm(prev => ({ ...prev, model: e.target.value }))}
              className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Price (৳) *</label>
            <input
              type="number"
              required
              value={form.price}
              onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
              className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Original Price (৳)</label>
            <input
              type="number"
              value={form.original_price}
              onChange={(e) => setForm(prev => ({ ...prev, original_price: e.target.value }))}
              className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Stock Quantity</label>
            <input
              type="number"
              value={form.stock_quantity}
              onChange={(e) => setForm(prev => ({ ...prev, stock_quantity: e.target.value }))}
              className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">SKU</label>
            <input
              type="text"
              value={form.sku}
              onChange={(e) => setForm(prev => ({ ...prev, sku: e.target.value }))}
              className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Short Description</label>
          <input
            type="text"
            value={form.short_description}
            onChange={(e) => setForm(prev => ({ ...prev, short_description: e.target.value }))}
            className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
          />
        </div>

        <div>
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Full Description</label>
          <textarea
            rows={5}
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
          />
        </div>

        {/* Checkboxes grid */}
        <div className="border-y border-gray-800 py-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-semibold">
          {[
            { key: 'is_featured', label: 'Featured Product' },
            { key: 'is_exclusive_deal', label: 'Exclusive Deal' },
            { key: 'is_best_deal', label: 'Best Deal' },
            { key: 'is_top_selling', label: 'Top Selling' },
            { key: 'is_new_arrival', label: 'New Arrival' },
            { key: 'is_active', label: 'Active Product' }
          ].map((chk) => (
            <label key={chk.key} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={(form as any)[chk.key]}
                onChange={(e) => setForm(prev => ({ ...prev, [chk.key]: e.target.checked }))}
                className="size-4.5 accent-primary"
              />
              <span>{chk.label}</span>
            </label>
          ))}
        </div>

        {/* Specs builder */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Specifications</h3>
            <button
              type="button"
              onClick={handleAddSpecRow}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={12} /> Add Specification
            </button>
          </div>

          <div className="space-y-2">
            {specs.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Spec Key (e.g. Battery)"
                  value={item.key}
                  onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                  className="flex-1 text-xs p-2.5 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white font-medium"
                />
                <input
                  type="text"
                  placeholder="Spec Value (e.g. 500mAh)"
                  value={item.value}
                  onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                  className="flex-1 text-xs p-2.5 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpecRow(idx)}
                  className="p-2.5 text-gray-500 hover:text-discount-red hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Form Action */}
        <div className="pt-4 border-t border-gray-800">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/10 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />} Update Product
          </button>
        </div>
      </form>
    </div>
  )
}
