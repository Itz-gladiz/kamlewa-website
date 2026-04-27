'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { LiaUsersSolid } from "react-icons/lia";
import { PiHandshake } from "react-icons/pi";

export default function Hero() {
  const t = useTranslations('hero');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const headlineVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay - Tech/Cybersecurity themed */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/images/lead_photo.jpg")',
            filter: 'grayscale(100%) brightness(0.4)',
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-32 pb-20 md:py-32">
        <motion.div
          className="max-w-5xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Headline */}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-yellow-400 mb-6 leading-tight max-w-5xl"
            variants={headlineVariants}
          >
            {t('headline')}
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-white mb-10 leading-relaxed max-w-3xl"
            variants={itemVariants}
            style={{ fontFamily: 'var(--font-nexa), sans-serif' }}
          >
            {t('subtext')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-row gap-3 sm:gap-4 w-full sm:max-w-md"
            variants={itemVariants}
          >
            <div className="relative group">
              {/* Shadow Box - Enhanced on hover */}
              <div className="absolute inset-0 bg-white/15 translate-x-1 translate-y-1 md:translate-x-2 md:translate-y-2 group-hover:translate-x-2 group-hover:translate-y-2 md:group-hover:translate-x-3 md:group-hover:translate-y-3 transition-all duration-300"></div>
              <Link 
                href="/community#volunteer"
                className="relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 overflow-hidden border-2 border-white text-white font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap group-hover:-translate-y-1 md:group-hover:-translate-y-2"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t('volunteer')}
                  <LiaUsersSolid className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out pointer-events-none"></span>
                <span className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 gap-2 pointer-events-none">
                  {t('volunteer')}
                  <LiaUsersSolid className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 translate-x-1" />
                </span>
              </Link>
            </div>
            <div className="relative group">
              {/* Shadow Box - Enhanced on hover */}
              <div className="absolute inset-0 bg-white/15 translate-x-1 translate-y-1 md:translate-x-2 md:translate-y-2 group-hover:translate-x-2 group-hover:translate-y-2 md:group-hover:translate-x-3 md:group-hover:translate-y-3 transition-all duration-300"></div>
              <Link 
                href="/community#partnerships"
                className="relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-yellow-400 text-black font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 cursor-pointer overflow-hidden flex items-center justify-center gap-2 whitespace-nowrap group-hover:-translate-y-1 md:group-hover:-translate-y-2"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t('partner')}
                  <PiHandshake className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out pointer-events-none"></span>
                <span className="absolute inset-0  flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 gap-2 pointer-events-none">
                  {t('partner')}
                  <PiHandshake className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
