'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { HiArrowRight, HiArrowLeft, HiHome, HiInformationCircle, HiCalendar, HiUserGroup, HiMail } from 'react-icons/hi';
import { Link } from '@/i18n/routing';
import { useRouter } from '@/i18n/routing';

export default function NotFoundClient() {
  const t = useTranslations('notFound');
  const nav = useTranslations('nav');
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
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


  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-20">
      <div className="max-w-5xl mx-auto w-full">
        <motion.div
          className="text-center mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 404 Number */}
          <motion.div
            className="mb-8"
            variants={itemVariants}
          >
            <h1
              className="text-9xl md:text-[12rem] lg:text-[14rem] font-bold text-yellow-400 leading-none"
              
            >
              404
            </h1>
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            variants={itemVariants}
          >
            {t('title')}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-yellow-400 text-lg md:text-xl mb-6"
            variants={itemVariants}
          >
            {t('subtitle')}
          </motion.p>

          {/* Description */}
          <motion.p
            className="text-gray-300 text-base md:text-lg mb-12 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            {t('description')}
          </motion.p>

          {/* Primary Actions */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            variants={itemVariants}
          >
            <Link
              href="/"
              className="group relative px-8 py-4 bg-yellow-400 text-black font-semibold text-base md:text-lg transition-all duration-300 cursor-pointer overflow-hidden inline-flex items-center gap-2 whitespace-nowrap"
            >
              <span className="relative z-10 flex items-center gap-2">
                <HiHome className="w-5 h-5" />
                {t('goHome')}
                <HiArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              <span className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 gap-2">
                <HiHome className="w-5 h-5" />
                {t('goHome')}
                <HiArrowRight className="w-5 h-5 transition-transform duration-300 translate-x-1" />
              </span>
            </Link>

            <span className="text-gray-500 text-sm">{t('or')}</span>

            <button
              onClick={() => router.back()}
              className="group relative px-8 py-4 border-2 border-white text-white font-semibold text-base md:text-lg transition-all duration-300 cursor-pointer overflow-hidden inline-flex items-center gap-2 whitespace-nowrap hover:bg-white hover:text-black"
            >
              <HiArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
              {t('goBack')}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
