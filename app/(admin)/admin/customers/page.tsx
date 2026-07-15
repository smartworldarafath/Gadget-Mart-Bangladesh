'use client'

import React, { useState, useEffect } from 'react'
import { Search, UserCheck, UserX, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Customer } from '@/lib/types'

export default function AdminCustomersPage() {
  const supabase = createClient()
  
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const loadCustomers = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        setCustomers(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const handleToggleAdmin = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('customers')
      .update({ is_admin: !currentStatus })
      .eq('id', id)

    if (!error) {
      setCustomers(prev =>
        prev.map(c => (c.id === id ? { ...c, is_admin: !currentStatus } : c))
      )
    } else {
      alert("Failed to updates role: " + error.message)
    }
  }

  const filteredCustomers = customers.filter(c =>
    (c.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone || '').includes(searchQuery)
  )

  return (
    <div className="space-y-8 select-none text-white">
      <div>
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider">Customer Directory</h1>
        <p className="text-xs text-gray-500 mt-1">Browse customer profiles and configure administrative credentials</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5 md:p-6 space-y-4">
        <div className="relative max-w-sm">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary text-white"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-gray-500 flex items-center justify-center gap-2">
            <RefreshCw className="animate-spin text-primary" size={16} /> Load directory details...
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800 text-xs text-left">
              <thead>
                <tr className="text-gray-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-center">Role Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300 font-medium">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-gray-950/30">
                    <td className="py-3.5 px-4 font-bold text-white">{cust.full_name || 'GMB Guest Customer'}</td>
                    <td className="py-3.5 px-4 text-gray-400">{cust.email || 'N/A'}</td>
                    <td className="py-3.5 px-4">{cust.phone || 'N/A'}</td>
                    <td className="py-3.5 px-4">{new Date(cust.created_at).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        cust.is_admin ? 'bg-rose-500/10 text-rose-500' : 'bg-gray-800 text-gray-400'
                      }`}>
                        {cust.is_admin ? 'Admin' : 'Customer'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleAdmin(cust.id, cust.is_admin)}
                        className={`text-xs font-bold hover:underline cursor-pointer ${
                          cust.is_admin ? 'text-gray-400 hover:text-white' : 'text-primary'
                        }`}
                      >
                        {cust.is_admin ? 'Demote to Customer' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 text-xs">
            No customer rows found in database directory.
          </div>
        )}
      </div>
    </div>
  )
}
