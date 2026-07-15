'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 2500)
    } catch (err: any) {
      setError(err.message || 'Failed to update password.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-[#F8F9FA] border border-gray-100 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-3xl font-extrabold text-primary">GMB</span>
          <h2 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight">New Password</h2>
          <p className="text-xs text-gray-400">Enter your new account password</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-xs font-semibold text-rose-800">
            <AlertTriangle size={16} className="text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl text-center text-xs font-semibold text-emerald-800 space-y-2">
            <div className="flex justify-center text-emerald-600">
              <CheckCircle2 size={32} />
            </div>
            <p className="font-extrabold text-sm text-emerald-900">Password Reset Successful!</p>
            <p>Your password has been updated. Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">New Password *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-medium"
                  placeholder="•••••••• (Min 6 chars)"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg shadow-primary/10 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
