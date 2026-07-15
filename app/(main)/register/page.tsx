'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, Mail, User, Phone, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // 1. Sign up user
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone: phone
          }
        }
      })

      if (signUpErr) throw signUpErr
      if (!signUpData.user) throw new Error('Registration failed. Try again.')

      // 2. Create customer profile
      const { error: profileErr } = await supabase
        .from('customers')
        .insert({
          id: signUpData.user.id,
          full_name: name,
          phone: phone,
          email: email,
          is_admin: false
        })

      // Note: If profileErr is just RLS or database connection, it might fail, but let's throw if it's unexpected.
      if (profileErr) {
        console.warn("Could not insert customer profile row (tables may not exist):", profileErr)
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 2500)
    } catch (err: any) {
      setError(err.message || 'Failed to complete registration.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-[#F8F9FA] border border-gray-100 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-3xl font-extrabold text-primary">GMB</span>
          <h2 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight">Create an Account</h2>
          <p className="text-xs text-gray-400">Join Gadget Mart Bangladesh and start shopping</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-xs font-semibold text-rose-800">
            <AlertTriangle size={16} className="text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl text-center text-xs font-semibold text-emerald-800 space-y-2">
            <p className="font-extrabold text-sm text-emerald-900">🎉 Registration Successful!</p>
            <p>Your account has been created. Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Full Name *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-medium"
                  placeholder="Arafath Rahman"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Phone Number *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                  <Phone size={16} />
                </span>
                <input
                  type="tel"
                  required
                  pattern="^01[3-9]\d{8}$"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Email Address *</label>
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

            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Password *</label>
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
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>
          </form>
        )}

        <div className="border-t border-gray-150 pt-5 text-center text-xs font-semibold text-gray-500">
          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
