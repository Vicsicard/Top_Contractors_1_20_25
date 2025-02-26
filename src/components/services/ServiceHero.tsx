import Image from 'next/image'

interface ServiceHeroProps {
  title: string
  description: string
}

export function ServiceHero({ title, description }: ServiceHeroProps) {
  return (
    <div className="relative h-[400px] w-full">
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
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"
        aria-hidden="true"
      />

      {/* Content - now with fixed width and no layout shifts */}
      <div className="relative h-full w-full">
        <div className="container mx-auto px-4 h-full">
          <div className="flex flex-col justify-center h-full max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-gray-100">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
