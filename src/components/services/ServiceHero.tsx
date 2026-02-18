import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, Star, CheckCircle, ArrowRight } from 'lucide-react'

interface ServiceHeroProps {
  title: string
  description: string
  showStats?: boolean
  showCTA?: boolean
}

export function ServiceHero({ title, description, showStats = false, showCTA = false }: ServiceHeroProps) {
  return (
    <div className="relative h-[500px] w-full">
      {/* Background Image - optimized for LCP */}
      <Image
        src="/images/denver sky 666.jpg"
        alt="Denver skyline"
        fill
        priority
        fetchPriority="high"
        className="object-cover"
        quality={90}
        sizes="100vw"
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAwIDYwMCI+PGZpbHRlciBpZD0iYiI+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMTIiIC8+PC9maWx0ZXI+PHBhdGggZmlsbD0iIzM0NTY4QiIgZD0iTTAgMGgxMDAwdjYwMEgweiIvPjxnIGZpbHRlcj0idXJsKCNiKSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMiwgMikgc2NhbGUoMy45MDYpIiBvcGFjaXR5PSIwLjUiPjxlbGxpcHNlIGZpbGw9IiNlZWQiIGN4PSIxODIiIGN5PSI2MCIgcng9IjMwMCIgcnk9IjM1IiAvPjwvZz48L3N2Zz4="
      />
      
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/40"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative h-full w-full">
        <div className="container mx-auto px-4 h-full">
          <div className="flex flex-col justify-center h-full max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
              {title}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-100 mb-6 leading-relaxed">
              {description}
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-8">
              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <ShieldCheck size={18} className="text-green-400" />
                </div>
                <span className="text-sm md:text-base font-medium">Background Verified</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <CheckCircle size={18} className="text-blue-400" />
                </div>
                <span className="text-sm md:text-base font-medium">Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Star size={18} className="text-yellow-400" />
                </div>
                <span className="text-sm md:text-base font-medium">Real Customer Reviews</span>
              </div>
            </div>

            {/* CTA Button */}
            {showCTA && (
              <div className="flex flex-wrap gap-4">
                <a
                  href="#services"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  Browse All Services
                  <ArrowRight size={18} />
                </a>
                <Link
                  href="/get-a-quote"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/30 transition-all duration-200"
                >
                  Get Free Quote
                </Link>
              </div>
            )}

            {/* Stats Bar */}
            {showStats && (
              <div className="mt-8 pt-8 border-t border-white/20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center md:text-left">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">500+</div>
                    <div className="text-sm text-gray-300">Verified Contractors</div>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">10K+</div>
                    <div className="text-sm text-gray-300">Customer Reviews</div>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">15</div>
                    <div className="text-sm text-gray-300">Trade Categories</div>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">14</div>
                    <div className="text-sm text-gray-300">Denver Locations</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
