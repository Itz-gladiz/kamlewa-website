'use client';

import { HiArrowLeft } from 'react-icons/hi';
import { Link, usePathname } from '@/i18n/routing';

export default function BackToHome() {
  const pathname = usePathname();

  if (!pathname) return null;

  const locales = ['en', 'fr'];
  const segments = pathname.split('/').filter(Boolean);
  const normalizedPath = locales.includes(segments[0])
    ? `/${segments.slice(1).join('/')}`
    : pathname;

  const allowedPaths = [
    '/about',
    '/community',
    '/events-impact',
    '/contact',
  ];

  if (!allowedPaths.includes(normalizedPath)) {
    return null;
  }

  return (
    <div className="bg-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-5">
        <div className="relative inline-flex group w-fit">
          <div className="absolute inset-0 bg-white/15 translate-x-1 translate-y-1 md:translate-x-2 md:translate-y-2 group-hover:translate-x-2 group-hover:translate-y-2 md:group-hover:translate-x-3 md:group-hover:translate-y-3 transition-all duration-300"></div>
          <Link
            href="/"
            aria-label="Back to Home"
            className="relative inline-flex w-full md:w-auto items-center justify-center gap-2 bg-yellow-400 px-6 py-3 font-semibold text-black transition-colors duration-300 hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-black group-hover:-translate-y-1 md:group-hover:-translate-y-2 transition-transform duration-300"
          >
            <HiArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

