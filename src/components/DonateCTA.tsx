'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Button from './Button';
import { BiDonateHeart } from "react-icons/bi";

export default function DonateCTA() {
  const t = useTranslations('donate');

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
    <section className="bg-black text-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Shadow Box */}
          <div className="absolute inset-0 bg-white/15 translate-x-3 translate-y-3 md:translate-x-6 md:translate-y-6 lg:translate-x-8 lg:translate-y-8"></div>
          
          {/* Main Yellow Box */}
          <div className="relative bg-yellow-400 text-black p-8 md:p-12 lg:p-16">
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6"
            variants={itemVariants}
            style={{ fontFamily: 'var(--font-nourd), sans-serif' }}
          >
            {t('heading')}
          </motion.h2>
          
          <motion.p
            className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-10 leading-relaxed max-w-3xl"
            variants={itemVariants}
          >
            {t('description')}
          </motion.p>

          <motion.div variants={itemVariants}>
            <Button variant="secondary" className="text-lg md:text-xl px-10 py-5">
              {t('button')}
              <BiDonateHeart className=" w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

