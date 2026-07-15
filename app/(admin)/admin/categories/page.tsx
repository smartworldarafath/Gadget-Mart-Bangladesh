'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search, Trash2, Edit, Save, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Category } from '@/lib/types'

export default function AdminCategoriesPage() {
  const supabase = createClient()
  
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  
  const [form, setForm] = useState({
    name: '',
    slug: '',
    icon_url: '🔌',
    display_order: '0',
    is_featured: false,
    is_active: true
  })

  const loadCategories = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })

    if (!error && data) {
      setCategories(data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleEditClick = (cat: Category) => {
    setIsEditing(true)
    setEditId(cat.id)
    setForm({
      name: cat.name,
      slug: cat.slug,
      icon_url: cat.icon_url || '🔌',
      display_order: cat.display_order.toString(),
      is_featured: cat.is_featured,
      is_active: cat.is_active
    })
  }

  const handleResetForm = () => {
    setIsEditing(false)
    setEditId(null)
    setForm({
      name: '',
      slug: '',
      icon_url: '🔌',
      display_order: '0',
      is_featured: false,
      is_active: true
    })
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    try {
      if (isEditing && editId) {
        const { error } = await supabase
          .from('categories')
          .update({
            name: form.name,
            slug: slug,
            icon_url: form.icon_url,
            display_order: parseInt(form.display_order) || 0,
            is_featured: form.is_featured,
            is_active: form.is_active
          })
          .eq('id', editId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('categories')
          .insert({
            name: form.name,
            slug: slug,
            icon_url: form.icon_url,
            display_order: parseInt(form.display_order) || 0,
            is_featured: form.is_featured,
            is_active: form.is_active
          })

        if (error) throw error
      }

      handleResetForm()
      loadCategories()
    } catch (err: any) {
      alert("Error saving category: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      const { error } = await supabase.from('categories').delete().eq('id', id)
      if (!error) {
        setCategories(prev => prev.filter(c => c.id !== id))
      } else {
        alert("Failed to delete: " + error.message)
      }
    }
  }

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8 select-none text-white">
      <div>
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider">Product Categories</h1>
        <p className="text-xs text-gray-500 mt-1">Manage e-commerce navigation divisions and groupings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Add/Edit Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleFormSubmit} className="bg-gray-900 border border-gray-800 rounded-3xl p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-black uppercase text-white tracking-widest pb-3 border-b border-gray-800">
              {isEditing ? 'Edit Category' : 'Add New Category'}
            </h3>

            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Slug (URL segment)</label>
              <input
                type="text"
                placeholder="auto-generated if empty"
                value={form.slug}
                onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value.toLowerCase() }))}
                className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Icon / Emoji</label>
                <input
                  type="text"
                  value={form.icon_url}
                  onChange={(e) => setForm(prev => ({ ...prev, icon_url: e.target.value }))}
                  className="w-full text-xs p-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white text-center"
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
            </div>

            <div className="flex gap-4 text-xs font-semibold pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                  className="size-4 accent-primary"
                />
                <span>Featured</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="size-4 accent-primary"
                />
                <span>Active</span>
              </label>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-800">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save size={14} /> Save
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-3 border border-gray-750 text-gray-400 hover:text-white rounded-xl text-xs font-bold uppercase"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right column: Categories Table */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-3xl p-5 md:p-6 space-y-4">
          <div className="relative max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
            />
          </div>

          {isLoading && categories.length === 0 ? (
            <div className="text-center py-16 text-gray-500 flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin text-primary" size={16} /> Load categories...
            </div>
          ) : filteredCategories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800 text-xs text-left">
                <thead>
                  <tr className="text-gray-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4 w-12 text-center">Icon</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4 text-center">Order</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-gray-300 font-medium">
                  {filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-950/30">
                      <td className="py-3.5 px-4 text-center text-xl select-none">{cat.icon_url}</td>
                      <td className="py-3.5 px-4 font-bold text-white">{cat.name}</td>
                      <td className="py-3.5 px-4 text-gray-500">{cat.slug}</td>
                      <td className="py-3.5 px-4 text-center">{cat.display_order}</td>
                      <td className="py-3.5 px-4 text-right space-x-2 shrink-0">
                        <button
                          onClick={() => handleEditClick(cat)}
                          className="p-2 bg-gray-850 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                          aria-label="Edit category"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-2 bg-gray-850 hover:bg-rose-950/30 text-gray-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                          aria-label="Delete category"
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
            <div className="text-center py-12 text-gray-500 text-xs">
              No categories found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
