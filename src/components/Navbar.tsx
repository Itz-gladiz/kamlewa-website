'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import UKFlag from './flags/UKFlag';
import FrenchFlag from './flags/FrenchFlag';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isEventsPage = pathname.includes('/events-impact');
      const isMobile = window.innerWidth < 768;
      
      // Show navbar with background when scrolled down
      if (currentScrollY > 100) {
        setIsScrolled(true);
        setIsVisible(true);
      } else {
        setIsScrolled(false);
        setIsVisible(true);
      }

      // Hide navbar when scrolling down, show when scrolling up
      // But keep it always visible on mobile for events-impact page
      if (isEventsPage && isMobile) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  // Check if a link is active
  const isActive = (href: string) => {
    // Remove locale prefix for comparison
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';
    const hrefWithoutLocale = href.replace(/^\/[a-z]{2}/, '') || '/';
    
    // Exact match or starts with (for nested routes)
    return pathWithoutLocale === hrefWithoutLocale || 
           (hrefWithoutLocale !== '/' && pathWithoutLocale.startsWith(hrefWithoutLocale));
  };

  const mobileMenu = (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 md:hidden"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              zIndex: 9998
            }}
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Slide-in Menu */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'spring',
              damping: 25,
              stiffness: 200
            }}
            className="fixed top-0 right-0 h-full w-full md:hidden shadow-2xl"
            style={{ 
              backgroundColor: '#000',
              zIndex: 9999
            }}
          >
            <div className="flex flex-col h-full p-8">
              {/* Header with Logo and Close Button */}
              <div className="flex items-center justify-between mb-8">
                {/* Logo with Text */}
                <Link 
                  href="/" 
                  className="flex items-center hover:opacity-90 transition-opacity"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="relative w-16 h-20 shrink-0">
                    <Image
                      src="/images/logo.png"
                      alt="Kamlewa Logo"
                      fill
                      sizes="100vw"
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col ml-3">
                    <h1 className="text-sm font-bold text-white uppercase" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                      Kamlewa Technologies
                    </h1>
                    <p className="tagline text-yellow-400 text-sm font-semibold">
                      Innovating Cyber Safety & Inspiring Growth
                    </p>
                  </div>
                </Link>

                {/* Close Button */}
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white hover:text-yellow-400 transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Menu Items */}
              <motion.div
                className="flex flex-col gap-6 mt-8"
                initial="closed"
                animate="open"
                variants={{
                  open: {
                    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
                  },
                  closed: {
                    transition: { staggerChildren: 0.05, staggerDirection: -1 }
                  }
                }}
              >
                <motion.div
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: 50 }
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link 
                    href="/about" 
                    className={`relative block text-2xl font-bold transition-colors duration-200 py-2 ${
                      isActive('/about') 
                        ? 'text-yellow-400' 
                        : 'text-white hover:text-yellow-400'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    style={{ fontFamily: 'var(--font-nourd), sans-serif' }}
                  >
                    {t('about')}
                    {isActive('/about') && (
                      <span className="absolute bottom-0 left-0 transform w-[10%] md:w-1/2 h-0.5 bg-yellow-400"></span>
                    )}
                  </Link>
                </motion.div>
                
                <motion.div
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: 50 }
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link 
                    href="/events-impact" 
                    className={`relative block text-2xl font-bold transition-colors duration-200 py-2 ${
                      isActive('/events-impact') 
                        ? 'text-yellow-400' 
                        : 'text-white hover:text-yellow-400'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    style={{ fontFamily: 'var(--font-nourd), sans-serif' }}
                  >
                    {t('events')}
                    {isActive('/events-impact') && (
                      <span className="absolute bottom-0 left-0 transform w-[10%] md:w-1/2 h-0.5 bg-yellow-400"></span>
                    )}
                  </Link>
                </motion.div>
                
                <motion.div
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: 50 }
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link 
                    href="/community" 
                    className={`relative block text-2xl font-bold transition-colors duration-200 py-2 ${
                      isActive('/community') 
                        ? 'text-yellow-400' 
                        : 'text-white hover:text-yellow-400'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    style={{ fontFamily: 'var(--font-nourd), sans-serif' }}
                  >
                    {t('community')}
                    {isActive('/community') && (
                      <span className="absolute bottom-0 left-0 transform w-[10%] md:w-1/2 h-0.5 bg-yellow-400"></span>
                    )}
                  </Link>
                </motion.div>
                
                <motion.div
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: 50 }
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link 
                    href="/contact" 
                    className={`relative block text-2xl font-bold transition-colors duration-200 py-2 ${
                      isActive('/contact') 
                        ? 'text-yellow-400' 
                        : 'text-white hover:text-yellow-400'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    style={{ fontFamily: 'var(--font-nourd), sans-serif' }}
                  >
                    {t('contact')}
                    {isActive('/contact') && (
                      <span className="absolute bottom-0 left-0 transform w-[10%] md:w-1/2 h-0.5 bg-yellow-400"></span>
                    )}
                  </Link>
                </motion.div>
              </motion.div>
              
              {/* Mobile Language Switcher */}
              <motion.div
                className="flex items-center gap-4 pt-8 mt-auto border-t border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <span className="text-white text-lg font-semibold">Language:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      switchLocale('en');
                      setIsMenuOpen(false);
                    }}
                    className={`p-3 transition-all duration-200  cursor-pointer ${
                      locale === 'en' 
                        ? 'bg-yellow-400 ring-2 ring-yellow-400' 
                        : 'opacity-70 hover:opacity-100 hover:bg-white/10'
                    }`}
                    aria-label="Switch to English"
                  >
                    <UKFlag className="w-7 h-7" />
                  </button>
                  <button
                    onClick={() => {
                      switchLocale('fr');
                      setIsMenuOpen(false);
                    }}
                    className={`p-3 transition-all duration-200  cursor-pointer ${
                      locale === 'fr' 
                        ? 'bg-yellow-400 ring-2 ring-yellow-400' 
                        : 'opacity-70 hover:opacity-100 hover:bg-white/10'
                    }`}
                    aria-label="Switch to French"
                  >
                    <FrenchFlag className="w-7 h-7" />
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-black/95 backdrop-blur-md border-b border-gray-800 shadow-lg' 
            : 'bg-transparent border-b border-transparent'
        } ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
      <div className="w-full max-w-7xl mx-auto px-6 py-6 md:px-12 lg:px-16 flex items-center justify-between">
        {/* Logo with Text */}
        <Link href="/" className="flex items-center hover:opacity-90 gap-2 transition-opacity">
          <div className="relative w-16 h-20 shrink-0">
            <Image
              src="/images/logo.png"
              alt="Kamlewa Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-md md:text-xl font-bold text-white uppercase" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
              Kamlewa Technologies
            </h1>
            <p className="tagline text-yellow-400 text-md md:text-md font-semibold">
              Innovating Cyber Safety & Inspiring Growth
            </p>
          </div>
        </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center gap-6 lg:gap-8">
        <Link 
          href="/about" 
          className={`relative transition-colors duration-200 text-sm lg:text-base ${
            isActive('/about') 
              ? 'text-yellow-400 font-semibold' 
              : 'text-white hover:text-yellow-400'
          }`}
        >
          {t('about')}
          {isActive('/about') && (
            <span className="absolute bottom-0 left-1/2 transform -translate-x-full w-1/2 h-0.5 bg-yellow-400"></span>
          )}
        </Link>
        <Link 
          href="/events-impact" 
          className={`relative transition-colors duration-200 text-sm lg:text-base ${
            isActive('/events-impact') 
              ? 'text-yellow-400 font-semibold' 
              : 'text-white hover:text-yellow-400'
          }`}
        >
          {t('events')}
          {isActive('/events-impact') && (
            <span className="absolute bottom-0 left-0 transform w-[10%] md:w-1/2 h-0.5 bg-yellow-400"></span>
          )}
        </Link>
        <Link 
          href="/community" 
          className={`relative transition-colors duration-200 text-sm lg:text-base ${
            isActive('/community') 
              ? 'text-yellow-400 font-semibold' 
              : 'text-white hover:text-yellow-400'
          }`}
        >
          {t('community')}
          {isActive('/community') && (
            <span className="absolute bottom-0 left-0 transform w-[10%] md:w-1/2 h-0.5 bg-yellow-400"></span>
          )}
        </Link>
        <Link 
          href="/contact" 
          className={`relative transition-colors duration-200 text-sm lg:text-base ${
            isActive('/contact') 
              ? 'text-yellow-400 font-semibold' 
              : 'text-white hover:text-yellow-400'
          }`}
        >
          {t('contact')}
          {isActive('/contact') && (
            <span className="absolute bottom-0 left-0 transform w-[10%] md:w-1/2 h-0.5 bg-yellow-400"></span>
          )}
        </Link>
        
        {/* Language Switcher */}
        <div className="flex items-center gap-2 border-l border-white/20 pl-4 ml-2">
          <div className="relative">
            {/* Shadow Box - Only for active locale */}
            {locale === 'en' && (
        <div className="absolute inset-0 bg-white translate-x-0.5 translate-y-0.5 "></div>
            )}
            <button
              onClick={() => switchLocale('en')}
              className={`relative p-1.5 transition-all duration-200  cursor-pointer ${
                locale === 'en' 
                  ? 'bg-yellow-400' 
                  : 'opacity-70 hover:opacity-100 hover:bg-white/10'
              }`}
              aria-label="Switch to English"
            >
              <UKFlag className="w-5 h-5 relative z-10" />
            </button>
          </div>
          <div className="relative">
            {/* Shadow Box - Only for active locale */}
            {locale === 'fr' && (
              <div className="absolute inset-0 bg-white translate-x-0.5 translate-y-0.5 "></div>
            )}
            <button
              onClick={() => switchLocale('fr')}
              className={`relative p-1.5 transition-all duration-200  cursor-pointer ${
                locale === 'fr' 
                  ? 'bg-yellow-400' 
                  : 'opacity-70 hover:opacity-100 hover:bg-white/10'
              }`}
              aria-label="Switch to French"
            >
              <FrenchFlag className="w-5 h-5 relative z-10" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="group md:hidden flex items-center justify-center relative z-10 transition-all duration-500 ease rounded p-[5px] cursor-pointer outline-none focus-visible:outline-0"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg
          fill="currentColor"
          stroke="none"
          strokeWidth="0"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 overflow-visible text-white transition-transform duration-[350ms] ease"
          style={{
            transform: isMenuOpen ? 'rotate(45deg)' : undefined,
            transitionDelay: isMenuOpen ? '250ms' : undefined,
          }}
        >
          <path
            className="transition-transform duration-[350ms] ease"
            style={{
              transform: isMenuOpen 
                ? 'rotate(112.5deg) translate(-27.2%, -80.2%)' 
                : undefined,
            }}
            d="m3.45,8.83c-.39,0-.76-.23-.92-.62-.21-.51.03-1.1.54-1.31L14.71,2.08c.51-.21,1.1.03,1.31.54.21.51-.03,1.1-.54,1.31L3.84,8.75c-.13.05-.25.08-.38.08Z"
          />
          <path
            className="transition-transform duration-[350ms] ease"
            style={{
              transform: isMenuOpen 
                ? 'rotate(22.5deg) translate(15.5%, -23%)' 
                : undefined,
            }}
            d="m2.02,17.13c-.39,0-.76-.23-.92-.62-.21-.51.03-1.1.54-1.31L21.6,6.94c.51-.21,1.1.03,1.31.54.21.51-.03,1.1-.54,1.31L2.4,17.06c-.13.05-.25.08-.38.08Z"
          />
          <path
            className="transition-transform duration-[350ms] ease"
            style={{
              transform: isMenuOpen 
                ? 'rotate(112.5deg) translate(-15%, -149.5%)' 
                : undefined,
            }}
            d="m8.91,21.99c-.39,0-.76-.23-.92-.62-.21-.51.03-1.1.54-1.31l11.64-4.82c.51-.21,1.1.03,1.31.54.21.51-.03,1.1-.54,1.31l-11.64,4.82c-.13.05-.25.08-.38.08Z"
          />
        </svg>
      </button>

      </div>
    </nav>
    {typeof window !== 'undefined' && createPortal(mobileMenu, document.body)}
    </>
  );
}

