'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Button from './Button';
import Image from 'next/image';
import { HiArrowRight } from 'react-icons/hi';
import { TbTargetArrow } from "react-icons/tb";
import { FaRegEye } from 'react-icons/fa';
import { Link } from '@/i18n/routing';

export default function About() {
  const t = useTranslations('about');

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

  return (
    <section id="about" className="bg-black text-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Left Side - Text Content */}
          <div>
            <motion.p
              className="tagline text-yellow-400 text-sm  md:text-base font-semibold mb-5 uppercase tracking-wider relative inline-block"
              variants={itemVariants}
            >
              {t('subheading')}
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-yellow-400"></span>
            </motion.p>
            
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              variants={itemVariants}
            >
              {t('heading')}
            </motion.h2>

            <motion.p
              className="text-gray-300 text-base md:text-lg leading-relaxed mb-8"
              variants={itemVariants}
            >
              {t('description')}
            </motion.p>

            {/* Mission */}
            <motion.div className="mb-8" variants={itemVariants}>
              <h3 className="text-yellow-400 text-lg md:text-xl font-semibold mb-3 flex items-center gap-3">
                {/* <TbTargetArrow className="w-6 h-6" /> */}
                {t('missionLabel')}
              </h3>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                {t('mission')}
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div className="mb-8" variants={itemVariants}>
              <h3 className="text-yellow-400 text-lg md:text-xl font-semibold mb-3 flex items-center gap-3">
                {/* <FaRegEye className="w-6 h-6" /> */}
                {t('visionLabel')}
              </h3>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                {t('vision')}
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="relative inline-block group">
                {/* Shadow Box - Enhanced on hover */}
                <div className="absolute inset-0 bg-white/15 translate-x-1 translate-y-1 md:translate-x-2 md:translate-y-2 group-hover:translate-x-2 group-hover:translate-y-2 md:group-hover:translate-x-3 md:group-hover:translate-y-3 transition-all duration-300"></div>
                <Link href="/about" className="relative px-8 py-4 bg-yellow-400 text-black font-semibold text-base md:text-lg transition-all duration-300 cursor-pointer overflow-hidden flex items-center gap-2 whitespace-nowrap group-hover:-translate-y-1 md:group-hover:-translate-y-2">
                  <span className="relative z-10 flex items-center gap-2">
                    {t('button')}
                    <HiArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left pointer-events-none"></span>
                  <span className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 gap-2 pointer-events-none">
                    {t('button')}
                    <HiArrowRight className="w-5 h-5 transition-transform duration-300 translate-x-1" />
                  </span>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Images with Overlap */}
          <div className="relative w-full h-96 md:h-[500px] lg:h-[600px]">
            {/* First Image - Base */}
            <motion.div
              className="relative w-full h-full bg-gray-800 overflow-hidden"
              variants={itemVariants}
            >
              <Image
                src="/images/about_home_2.jpg"
                alt={t('imageAlt1')}
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Second Image - Overlapping with translate */}
            <motion.div
              className="absolute bottom-0 w-3/4 md:w-2/3 h-2/3 md:h-3/4 translate-x-10 md:translate-x-12 lg:translate-x-70 translate-y-14 md:translate-y-6 lg:translate-y-20"
              variants={itemVariants}
            >
              <div className="relative w-full h-full bg-gray-800 overflow-hidden border-4 md:border-6 lg:border-10 rounded-tl-xl border-black">
                <Image
                src="/images/about_home.jpg"
                alt={t('imageAlt2')}
                  fill
                  className="object-cover rounded-tl-xl"
                />
                {/* Impact Stat Overlay - Orange Box */}
                <div className="absolute bottom-4 left-4 bg-white   -500 px-4 py-3">
                  <p className="text-black font-bold text-lg md:text-xl leading-tight">
                    {t('impactStat')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

