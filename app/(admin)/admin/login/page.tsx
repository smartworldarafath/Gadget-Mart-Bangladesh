'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, AlertTriangle, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Sign in user
      const { data, error: signInErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInErr) throw signInErr
      if (!data.user) throw new Error('Authentication failed.')

      // Check if user is admin
      const { data: customer, error: custErr } = await supabase
        .from('customers')
        .select('is_admin')
        .eq('id', data.user.id)
        .single()

      if (custErr || !customer?.is_admin) {
        // Sign out immediately and display access denied
        await supabase.auth.signOut()
        throw new Error('Access denied: Unauthorized customer role.')
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Invalid admin login credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 text-white">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center text-primary">
            <ShieldCheck size={48} className="stroke-[1.5]" />
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider">GMB Admin Portal</h2>
          <p className="text-xs text-gray-500">Sign in to access management console</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-950/50 border border-rose-900/50 rounded-2xl flex items-center gap-3 text-xs font-semibold text-rose-200">
            <AlertTriangle size={16} className="text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Admin Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary font-medium text-white"
                placeholder="admin@gadgetmartbd.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-primary font-medium text-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg shadow-primary/10 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
