'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    title: 'Flagship Power Stations',
    description: 'Up to 100W GaN chargers for laptops, notebooks and phones at best prices in BD.',
    buttonText: 'Explore Adapters',
    link: '/category/adapter',
    bg: 'from-orange-600 to-red-700'
  },
  {
    title: 'TWS Earbuds Collection',
    description: 'Experience pure acoustic fidelity with leading brands. QCY, Wavefun, Hoco, Awei, Imiki & more.',
    buttonText: 'Shop Wireless Audio',
    link: '/category/wireless-headphone',
    bg: 'from-gray-900 via-gray-800 to-indigo-950'
  },
  {
    title: 'Exclusive Deals GMB',
    description: 'Get up to 25% discount on top tech gear. Limited period pricing in Bangladeshi Taka.',
    buttonText: 'Check Offers',
    link: '/offers',
    bg: 'from-blue-900 to-cyan-900'
  }
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative w-full h-[280px] md:h-[420px] bg-black overflow-hidden group">
      {/* Slides wrapper */}
      <div className="w-full h-full relative">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full flex flex-col justify-center px-6 md:px-16 bg-gradient-to-r ${
              slide.bg
            } transition-opacity duration-700 ease-in-out ${
              index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Visual background overlays */}
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            
            <div className="relative max-w-7xl mx-auto w-full z-20 space-y-3 md:space-y-5 select-none fade-in-slide">
              <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-primary">
                Gadget Mart Special
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-none tracking-tight">
                {slide.title}
              </h1>
              <p className="text-sm md:text-lg text-gray-200 max-w-xl line-clamp-2 md:line-clamp-none font-medium">
                {slide.description}
              </p>
              <div>
                <a
                  href={slide.link}
                  className="inline-block px-6 py-2.5 md:px-8 md:py-3.5 bg-primary hover:bg-primary-hover text-white text-xs md:text-sm font-bold uppercase tracking-wider rounded-full shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  {slide.buttonText}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nav Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-primary text-white hover:scale-110 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-primary text-white hover:scale-110 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
              index === current ? 'bg-primary w-6' : 'bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
