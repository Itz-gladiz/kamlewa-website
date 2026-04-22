'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

export default function CommunityPreview() {
  const t = useTranslations('community');
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const communities = [
    {
      name: t('kamcyber'),
      description: t('kamcyberDesc'),
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070',
    },
    {
      name: t('hackthebox'),
      description: t('hacktheboxDesc'),
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070',
    },
    {
      name: t('owasp'),
      description: t('owaspDesc'),
      image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=2070',
    },
  ];

  return (
    <section className="bg-[#1b1b1b] text-black py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section Header */}
          <motion.div className="text-left mb-12 md:mb-16" variants={itemVariants}>
            <motion.p
              className="tagline text-yellow-400 text-sm md:text-base font-semibold mb-5 uppercase tracking-wider relative inline-block"
              variants={itemVariants}
            >
              {t('subheading')}
              <span className="absolute bottom-0 left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0 w-1/2 h-0.5 bg-yellow-400"></span>
            </motion.p>
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white"
              variants={itemVariants}
              style={{ fontFamily: 'var(--font-nourd), sans-serif' }}
            >
              {t('heading')}
            </motion.h2>
            <motion.p
              className="text-gray-300 text-base md:text-lg max-w-3xl md:max-w-2xl mx-auto md:mx-0"
              variants={itemVariants}
            >
              {t('description')}
            </motion.p>
          </motion.div>

          {/* Communities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            {communities.map((community, index) => {
              const isActive = activeCard === index;
              return (
                <motion.div
                  key={index}
                  className="relative h-64 md:h-80 overflow-hidden group cursor-pointer"
                  variants={itemVariants}
                  onClick={() => setActiveCard(isActive ? null : index)}
                >
                  {/* Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={community.image}
                      alt={community.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 transition-colors duration-300 ${isActive ? 'bg-black/70' : 'bg-black/40 group-hover:bg-black/70'}`}></div>
                  </div>

                  {/* Content - Always visible title */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-basement), sans-serif' }}>
                      {community.name}
                    </h3>
                  </div>

                  {/* Hover Overlay - Description */}
                  <div className={`absolute inset-0 bg-black/90 p-6 flex flex-col justify-center transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <h3 className="text-xl md:text-2xl font-bold text-yellow-400 mb-4" style={{ fontFamily: 'var(--font-basement), sans-serif' }}>
                      {community.name}
                    </h3>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
                      {community.description}
                    </p>
                    <Link 
                      href="/community" 
                      className="tagline inline-flex items-center gap-2 text-yellow-400 font-semibold text-base md:text-2xl hover:text-yellow-300 transition-colors relative group/link pb-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="relative">
                        View Community
                        {/* Zigzag Underline */}
                        <svg 
                          className="absolute -bottom-1 left-0 w-full" 
                          preserveAspectRatio="none" 
                          viewBox="0 0 200 10"
                          style={{ height: '6px' }}
                        >
                          <path 
                            d="M0,8 L10,2 L20,8 L30,2 L40,8 L50,2 L60,8 L70,2 L80,8 L90,2 L100,8 L110,2 L120,8 L130,2 L140,8 L150,2 L160,8 L170,2 L180,8 L190,2 L200,8" 
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            className="text-yellow-400"
                          />
                        </svg>
                      </span>
                      <HiArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <motion.div className="flex flex-row gap-3 sm:gap-4 justify-start" variants={itemVariants}>
            <div className="relative group">
              {/* Shadow Box - Enhanced on hover */}
              <div className="absolute inset-0 bg-white/15 translate-x-1 translate-y-1 md:translate-x-2 md:translate-y-2 group-hover:translate-x-2 group-hover:translate-y-2 md:group-hover:translate-x-3 md:group-hover:translate-y-3 transition-all duration-300"></div>
              <Link href="/community#volunteer" className="relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 overflow-hidden border-2 border-white text-white font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap group-hover:-translate-y-1 md:group-hover:-translate-y-2">
                <span className="relative z-10 flex items-center gap-2">
                  {t('volunteer')}
                  <HiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left pointer-events-none"></span>
                <span className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 gap-2 pointer-events-none">
                  {t('volunteer')}
                  <HiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 translate-x-1" />
                </span>
              </Link>
            </div>
            <div className="relative group">
              {/* Shadow Box - Enhanced on hover */}
              <div className="absolute inset-0 bg-white/15 translate-x-1 translate-y-1 md:translate-x-2 md:translate-y-2 group-hover:translate-x-2 group-hover:translate-y-2 md:group-hover:translate-x-3 md:group-hover:translate-y-3 transition-all duration-300"></div>
              <Link href="/community" className="relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-yellow-400 text-black font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 cursor-pointer overflow-hidden flex items-center justify-center gap-2 whitespace-nowrap group-hover:-translate-y-1 md:group-hover:-translate-y-2">
                <span className="relative z-10 flex items-center gap-2">
                  {t('viewAll')}
                  <HiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left pointer-events-none"></span>
                <span className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 gap-2 pointer-events-none">
                  {t('viewAll')}
                  <HiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 translate-x-1" />
                </span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

