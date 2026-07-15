import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  // Determine details based on slug
  const title = slug === 'top-5-qcy-earbuds-bangladesh' 
    ? 'Top 5 QCY Earbuds in Bangladesh (2025 Review)'
    : 'Why GaN Technology is Changing Wall Chargers Forever'

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 select-none">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary transition-colors">
        <ArrowLeft size={14} /> Back to Blog
      </Link>

      <div className="space-y-3">
        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">July 15, 2026</span>
        <h1 className="text-2xl md:text-4xl font-black text-gray-800 tracking-tight leading-tight">{title}</h1>
        <p className="text-xs text-primary font-bold">Written by GMB Tech Editor</p>
      </div>

      <div className="prose max-w-none text-xs md:text-sm text-gray-600 leading-relaxed font-medium pt-4 border-t border-gray-150 space-y-4">
        <p>
          Tech accessories are evolving faster than ever in Bangladesh, and mobile audio and charging technology are leading the charge. In this article, we cover key features, build specifications, and performance values to help BD consumers make informed choices when shopping.
        </p>
        <p>
          Whether you are looking for high-quality wireless sound through budget earbuds or need ultra-fast adapters for multi-device setups, GMB provides authentic products with official warranties. Check our catalog divisions for exclusive deals!
        </p>
      </div>
    </div>
  )
}
