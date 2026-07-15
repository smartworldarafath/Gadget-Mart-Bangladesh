'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeftRight } from 'lucide-react'

export default function ComparePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4 select-none">
      <div className="flex justify-center text-primary">
        <ArrowLeftRight size={48} className="stroke-[1.5]" />
      </div>
      <h1 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight">Compare Gadgets</h1>
      <p className="text-xs text-gray-500 max-w-sm mx-auto">
        Add products from their detail pages to compare specifications side-by-side. Coming soon in GMB!
      </p>
      <div>
        <Link 
          href="/" 
          className="inline-block px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase rounded-full"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  )
}
