import type { Metadata } from 'next'
import "./globals.css"

export const metadata: Metadata = {
  title: 'Gadget Mart Bangladesh (GMB) - Premium Tech & Accessories Store',
  description: 'GMB is a leading gadgets and premium accessories store in Bangladesh. Buy smartphones, chargers, TWS earbuds, smartwatches, and more.',
  icons: {
    icon: '/favicon.ico',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-primary selection:text-white antialiased">
        {children}
      </body>
    </html>
  )
}
