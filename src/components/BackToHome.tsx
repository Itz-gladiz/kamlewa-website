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
        <Link
          href="/"
          aria-label="Back to Home"
          className="inline-flex w-full md:w-auto items-center justify-center gap-2 bg-yellow-400 px-6 py-3 font-semibold text-black transition-colors duration-300 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-black"
        >
          <HiArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
