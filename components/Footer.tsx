import React from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 text-sm mt-auto border-t border-gray-900 print:hidden pb-16 xl:pb-0">
      {/* Top Footer Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12 px-4">
        {/* About column */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">GMB</span>
            <span className="text-white font-semibold text-[13px] tracking-wide">GADGET MART<br />BANGLADESH</span>
          </Link>
          <p className="text-xs leading-relaxed text-gray-500">
            Gadget Mart Bangladesh (GMB) is one of the leading tech and gadget retail stores in Bangladesh. We bring you authentic premium accessories, smartphones, adapters, and audio gadgets.
          </p>
          <div className="flex gap-3 pt-2">
            <a href="https://facebook.com" className="p-2 bg-gray-900 hover:bg-primary hover:text-white rounded-full transition-colors"><Facebook size={16} /></a>
            <a href="https://instagram.com" className="p-2 bg-gray-900 hover:bg-primary hover:text-white rounded-full transition-colors"><Instagram size={16} /></a>
            <a href="https://twitter.com" className="p-2 bg-gray-900 hover:bg-primary hover:text-white rounded-full transition-colors"><Twitter size={16} /></a>
            <a href="https://youtube.com" className="p-2 bg-gray-900 hover:bg-primary hover:text-white rounded-full transition-colors"><Youtube size={16} /></a>
          </div>
        </div>

        {/* Categories column */}
        <div className="space-y-3">
          <h3 className="text-white font-bold text-base tracking-wide border-b border-gray-800 pb-2">Categories</h3>
          <ul className="space-y-2 text-xs">
            <li><Link href="/category/mobile-phone" className="hover:text-primary transition-colors">Phones & Smart Devices</Link></li>
            <li><Link href="/category/laptop" className="hover:text-primary transition-colors">Laptops & MacBooks</Link></li>
            <li><Link href="/category/tablet" className="hover:text-primary transition-colors">Tablets & iPad Accessories</Link></li>
            <li><Link href="/category/wireless-headphone" className="hover:text-primary transition-colors">Wireless Headphones & TWS</Link></li>
            <li><Link href="/category/adapter" className="hover:text-primary transition-colors">Fast Power Wall Adapters</Link></li>
          </ul>
        </div>

        {/* Quick Links column */}
        <div className="space-y-3">
          <h3 className="text-white font-bold text-base tracking-wide border-b border-gray-800 pb-2">Quick Links</h3>
          <ul className="space-y-2 text-xs">
            <li><Link href="/offers" className="hover:text-primary transition-colors">Exclusive Deals & Offers</Link></li>
            <li><Link href="/pre-order" className="hover:text-primary transition-colors">Pre-order Gadgets</Link></li>
            <li><Link href="/compare" className="hover:text-primary transition-colors">Compare Products</Link></li>
            <li><Link href="/track-order" className="hover:text-primary transition-colors">Track Order</Link></li>
            <li><Link href="/blog" className="hover:text-primary transition-colors">Tech Blog & Reviews</Link></li>
          </ul>
        </div>

        {/* Contact info column */}
        <div className="space-y-3">
          <h3 className="text-white font-bold text-base tracking-wide border-b border-gray-800 pb-2">Support Outlet</h3>
          <ul className="space-y-3 text-xs">
            <li className="flex gap-2.5 items-start">
              <MapPin size={16} className="text-primary shrink-0" />
              <span>GMB Central Store, Level 4, Jamuna Future Park, Dhaka, Bangladesh</span>
            </li>
            <li className="flex gap-2.5 items-center">
              <Phone size={16} className="text-primary shrink-0" />
              <span>01977-123456 (10 AM - 8 PM)</span>
            </li>
            <li className="flex gap-2.5 items-center">
              <Mail size={16} className="text-primary shrink-0" />
              <span>support@gadgetmartbd.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Payment Gateways Bar */}
      <div className="border-t border-gray-900 bg-black/30 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <p className="text-xs text-gray-500">Supported Secure Payment Methods</p>
            <div className="flex flex-wrap gap-2.5 mt-2 justify-center md:justify-start">
              <span className="px-2.5 py-1 bg-white/5 rounded text-[10px] font-bold text-gray-400 border border-white/5">bKash</span>
              <span className="px-2.5 py-1 bg-white/5 rounded text-[10px] font-bold text-gray-400 border border-white/5">Nagad</span>
              <span className="px-2.5 py-1 bg-white/5 rounded text-[10px] font-bold text-gray-400 border border-white/5">Rocket</span>
              <span className="px-2.5 py-1 bg-white/5 rounded text-[10px] font-bold text-gray-400 border border-white/5">Visa / MasterCard</span>
              <span className="px-2.5 py-1 bg-white/5 rounded text-[10px] font-bold text-gray-400 border border-white/5">Cash on Delivery</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">© 2025 Gadget Mart Bangladesh. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
