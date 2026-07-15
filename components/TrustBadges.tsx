import React from 'react'
import { Percent, Truck, ArrowLeftRight, PiggyBank, ShieldCheck } from 'lucide-react'

export default function TrustBadges() {
  const badges = [
    { title: 'Easy EMI Available', icon: Percent, desc: 'Up to 12 months EMI', color: 'text-orange-500 bg-orange-50' },
    { title: 'Fastest Home Delivery', icon: Truck, desc: 'Delivery in 24-72 hours', color: 'text-blue-500 bg-blue-50' },
    { title: 'Exchange Facility', icon: ArrowLeftRight, desc: 'Upgrade old tech easily', color: 'text-indigo-500 bg-indigo-50' },
    { title: 'Best Price Deals', icon: PiggyBank, desc: 'Assured best price in BD', color: 'text-emerald-500 bg-emerald-50' },
    { title: 'After-Sales Service', icon: ShieldCheck, desc: 'GMB Official Warranty', color: 'text-purple-500 bg-purple-50' }
  ]

  return (
    <div className="w-full bg-[#F8F9FA] border-y border-gray-150/80 py-4 px-4 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 min-w-[900px] xl:min-w-0">
        {badges.map((item, index) => {
          const Icon = item.icon
          return (
            <div key={index} className="flex items-center gap-3 flex-1 select-none">
              <div className={`p-2.5 rounded-2xl ${item.color} shrink-0`}>
                <Icon size={20} className="stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-gray-800 leading-tight">{item.title}</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
