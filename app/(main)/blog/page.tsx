import React from 'react'
import Link from 'next/link'

const blogPosts = [
  {
    title: 'Top 5 QCY Earbuds in Bangladesh (2025 Review)',
    slug: 'top-5-qcy-earbuds-bangladesh',
    excerpt: 'An in-depth comparison of the best budget-friendly active noise cancelling QCY earbuds available in BD.',
    date: 'July 15, 2026',
    author: 'GMB Tech Editor'
  },
  {
    title: 'Why GaN Technology is Changing Wall Chargers Forever',
    slug: 'gan-technology-wall-chargers-explained',
    excerpt: 'Understand how Gallium Nitride (GaN) powers smaller, cooler, and faster multi-port adapters for MacBook and phones.',
    date: 'June 28, 2026',
    author: 'Charging Expert'
  }
]

export default function BlogListingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 select-none">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-800 uppercase tracking-tight">GMB Tech Blog</h1>
        <p className="text-xs text-gray-500 mt-1">Product reviews, technology deep dives, and buying guides</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogPosts.map((post) => (
          <div key={post.slug} className="bg-card-bg border border-gray-100 rounded-3xl p-5 md:p-6 space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">{post.date}</span>
              <h2 className="text-base md:text-lg font-black text-gray-800 hover:text-primary transition-colors leading-tight">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 font-medium">{post.excerpt}</p>
            </div>
            <div className="pt-2 border-t border-gray-150 flex justify-between items-center text-[10px] font-bold text-gray-400">
              <span>By {post.author}</span>
              <Link href={`/blog/${post.slug}`} className="text-primary uppercase tracking-wider font-extrabold hover:underline">Read Article →</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
