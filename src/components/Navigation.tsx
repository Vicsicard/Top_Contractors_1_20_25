 'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex-1">
      <div className="flex justify-between items-center">
        <Link 
          href="/" 
          className="hover:opacity-90 transition-opacity"
        >
          <div>
            <span className="lg:inline hidden text-2xl font-bold text-white">
              Top Contractors Denver
            </span>
            <span className="lg:hidden text-xl font-bold text-white">
              TCD
            </span>
          </div>
        </Link>
        
        <div className="flex items-center gap-4 md:gap-8">
          <Link 
            href="/" 
            className={`text-white hover:text-accent-warm transition-colors font-medium flex items-center gap-2 ${
              pathname === '/' ? 'text-accent-warm' : ''
            }`}
          >
            <svg className="w-6 h-6 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="hidden md:inline">Home</span>
          </Link>
          <Link 
            href="/blog/" 
            className={`text-white hover:text-accent-warm transition-colors font-medium flex items-center gap-2 ${
              pathname?.startsWith('/blog') ? 'text-accent-warm' : ''
            }`}
          >
            <svg className="w-6 h-6 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" />
            </svg>
            <span className="hidden md:inline">Blog</span>
          </Link>
          <Link 
            href="/services/" 
            className={`text-white hover:text-accent-warm transition-colors font-medium flex items-center gap-2 ${
              pathname?.startsWith('/services') ? 'text-accent-warm' : ''
            }`}
          >
            <svg className="w-6 h-6 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="hidden md:inline">Services</span>
          </Link>
          <Link 
            href="/videos/" 
            className={`text-white hover:text-accent-warm transition-colors font-medium flex items-center gap-2 ${
              pathname?.startsWith('/videos') ? 'text-accent-warm' : ''
            }`}
          >
            <svg className="w-6 h-6 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="hidden md:inline">Videos</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
