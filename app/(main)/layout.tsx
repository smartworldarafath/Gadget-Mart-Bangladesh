import React from 'react'
import Header from '@/components/Header'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MobileNav from '@/components/MobileNav'
import { CartProvider } from '@/components/CartContext'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <Header />
      <Navbar />
      <div className="flex-1 flex flex-col pb-14 xl:pb-0">
        {children}
      </div>
      <Footer />
      <MobileNav />
    </CartProvider>
  )
}
