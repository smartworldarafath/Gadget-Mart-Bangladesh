'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Mail, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send recovery email.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-[#F8F9FA] border border-gray-100 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-3xl font-extrabold text-primary">GMB</span>
          <h2 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight">Reset Password</h2>
          <p className="text-xs text-gray-400">Enter your email and we'll send you a password recovery link</p>
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
            <p className="font-extrabold text-sm text-emerald-900">Recovery Email Sent!</p>
            <p>Please check your inbox (and spam folder) for instructions to reset your password.</p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-medium"
                  placeholder="yourname@gmail.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg shadow-primary/10 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Sending...' : 'Send Recovery Link'}
            </button>
          </form>
        )}

        <div className="border-t border-gray-150 pt-5 text-center text-xs font-semibold text-gray-500">
          <Link href="/login" className="text-primary font-bold hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
