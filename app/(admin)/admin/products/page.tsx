'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Trash2, Edit, Upload, Download, Check, AlertTriangle, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Product, Category } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

export default function AdminProductsPage() {
  const supabase = createClient()
  
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  // CSV Import States
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [importStatus, setImportStatus] = useState<'idle' | 'parsing' | 'saving' | 'success' | 'error'>('idle')
  const [importMessage, setImportMessage] = useState('')

  // Load products & categories
  const loadData = async () => {
    setIsLoading(true)
    try {
      const { data: catData } = await supabase.from('categories').select('*')
      if (catData) setCategories(catData)

      const { data: prodData } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (prodData) setProducts(prodData)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (!error) {
        setProducts(prev => prev.filter(p => p.id !== id))
      } else {
        alert("Failed to delete product: " + error.message)
      }
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !currentStatus })
      .eq('id', id)

    if (!error) {
      setProducts(prev =>
        prev.map(p => (p.id === id ? { ...p, is_active: !currentStatus } : p))
      )
    }
  }

  // Local client CSV Parser
  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCsvFile(file)
    setImportStatus('parsing')
    setImportMessage(`Reading file: ${file.name}...`)

    const reader = new FileReader()
    reader.onload = async (evt) => {
      const text = evt.target?.result as string
      if (!text) {
        setImportStatus('error')
        setImportMessage('Failed to read CSV text content.')
        return
      }

      try {
        const rows = text.split('\n').map(r => r.trim()).filter(Boolean)
        if (rows.length < 2) {
          throw new Error('CSV must contain a header row and at least one data row.')
        }

        const headers = rows[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim())
        const parsedProducts: any[] = []

        // Dynamic categories map
        const catMap: Record<string, string> = {}
        categories.forEach(c => {
          catMap[c.slug] = c.id
        })

        for (let i = 1; i < rows.length; i++) {
          const rowData = rows[i].split(',').map(cell => cell.replace(/^["']|["']$/g, '').trim())
          if (rowData.length < headers.length) continue

          const item: Record<string, any> = {}
          headers.forEach((header, idx) => {
            item[header] = rowData[idx]
          })

          // Map CSV columns to products schema
          const name = item.name
          const brand = item.brand || 'Generic'
          const price = parseFloat(item.price) || 0
          const originalPrice = parseFloat(item.original_price) || null
          const categorySlug = item.category_slug || 'adapter'
          const stock = parseInt(item.stock_quantity) || 10
          const sku = item.sku || `CSV-${Date.now().toString().slice(-4)}-${i}`

          if (!name) continue

          // Generate slug
          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          const categoryId = catMap[categorySlug] || categories[0]?.id || null

          parsedProducts.push({
            name,
            slug,
            brand,
            price,
            original_price: originalPrice,
            category_id: categoryId,
            stock_quantity: stock,
            sku,
            description: item.description || `Original ${name} by ${brand}.`,
            short_description: item.short_description || `Premium ${name}.`,
            is_active: true
          })
        }

        if (parsedProducts.length === 0) {
          throw new Error('No valid products parsed from CSV file.')
        }

        setImportStatus('saving')
        setImportMessage(`Saving ${parsedProducts.length} products to database...`)

        const { error: upsertErr } = await supabase
          .from('products')
          .upsert(parsedProducts, { onConflict: 'slug' })

        if (upsertErr) throw upsertErr

        setImportStatus('success')
        setImportMessage(`Successfully imported ${parsedProducts.length} products!`)
        loadData()
      } catch (err: any) {
        setImportStatus('error')
        setImportMessage(err.message || 'Error processing CSV rows.')
      }
    }
    reader.readAsText(file)
  }

  // Filter products by search query
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const catMap: Record<string, string> = {}
  categories.forEach(c => {
    catMap[c.id] = c.name
  })

  return (
    <div className="space-y-8 select-none text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider">Product Inventory</h1>
          <p className="text-xs text-gray-500 mt-1">Manage Gadget Mart items and bulk import new catalogs</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {/* CSV file uploader button */}
          <label className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-2 border border-gray-700">
            <Upload size={14} /> Bulk Import CSV
            <input 
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="hidden"
            />
          </label>
          <Link
            href="/admin/products/add"
            className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/10"
          >
            <Plus size={14} /> Add Product
          </Link>
        </div>
      </div>

      {/* CSV Import Notification */}
      {importStatus !== 'idle' && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 text-xs font-semibold ${
          importStatus === 'success' ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-300' :
          importStatus === 'error' ? 'bg-rose-950/40 border-rose-900/50 text-rose-300' :
          'bg-gray-900 border-gray-800 text-gray-300'
        }`}>
          <div className="flex items-center gap-3">
            {importStatus === 'parsing' || importStatus === 'saving' ? <RefreshCw className="animate-spin text-primary shrink-0" size={16} /> :
             importStatus === 'success' ? <Check className="text-emerald-500 shrink-0" size={16} /> :
             <AlertTriangle className="text-rose-500 shrink-0" size={16} />}
            <span>{importMessage}</span>
          </div>
          <button 
            onClick={() => setImportStatus('idle')}
            className="text-[10px] uppercase font-bold text-gray-500 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Product Table actions and search */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5 md:p-6 space-y-4">
        <div className="flex items-center gap-2 max-w-sm">
          <label htmlFor="search" className="sr-only">Search</label>
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none">
              <Search size={14} />
            </span>
            <input 
              id="search"
              type="text"
              placeholder="Search by name, brand, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
            />
          </div>
        </div>

        {/* Inventory listing */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-500 flex items-center justify-center gap-2 font-semibold">
            <RefreshCw className="animate-spin text-primary" size={16} /> Load inventory details...
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800 text-xs text-left">
              <thead>
                <tr className="text-gray-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Active</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300 font-medium">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-950/30">
                    <td className="py-3.5 px-4 font-bold text-white max-w-[220px] truncate">{prod.name}</td>
                    <td className="py-3.5 px-4">{catMap[prod.category_id || ''] || 'Adapter'}</td>
                    <td className="py-3.5 px-4 font-bold">{formatPrice(prod.price)}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        prod.stock_quantity < 5 ? 'bg-rose-500/10 text-rose-500' : 'bg-gray-800 text-gray-300'
                      }`}>
                        {prod.stock_quantity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 font-bold">{prod.sku || 'N/A'}</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(prod.id, prod.is_active)}
                        className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase transition-colors cursor-pointer ${
                          prod.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {prod.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2 shrink-0">
                      <Link 
                        href={`/admin/products/edit/${prod.id}`}
                        className="p-2 bg-gray-850 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors inline-block"
                        aria-label="Edit product"
                      >
                        <Edit size={12} />
                      </Link>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="p-2 bg-gray-850 hover:bg-rose-950/30 text-gray-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                        aria-label="Delete product"
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
          <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-2xl text-xs text-gray-500">
            No products found in database. Feel free to click "Add Product" or upload a CSV file!
          </div>
        )}
      </div>
    </div>
  )
}
