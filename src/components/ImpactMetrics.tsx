'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface MetricProps {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
}

function AnimatedCounter({ value, suffix = '', label, delay = 0 }: MetricProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, value, delay]);

  return (
    <div ref={ref} className="text-left">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: delay / 1000 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-400 mb-4 md:mb-6"
        style={{ fontFamily: 'var(--font-nourd), sans-serif', letterSpacing: '0.02em' }}
      >
        {count.toLocaleString()}{suffix}
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: (delay + 500) / 1000 }}
        className="text-white text-sm md:text-base lg:text-lg"
      >
        {label}
      </motion.p>
    </div>
  );
}

export default function ImpactMetrics() {
  const t = useTranslations('impact');

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

  const metrics = [
    {
      value: 5000,
      suffix: '+',
      label: t('youthReached'),
      delay: 0,
    },
    {
      value: 150,
      suffix: '+',
      label: t('events'),
      delay: 200,
    },
    {
      value: 25,
      suffix: '+',
      label: t('communities'),
      delay: 400,
    },
    {
      value: 1000,
      suffix: '+',
      label: t('trainingHours'),
      delay: 600,
    },
  ];

  return (
    <section id="events-impact" className="bg-black text-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 lg:gap-20 justify-items-start">
            {metrics.map((metric, index) => (
              <AnimatedCounter
                key={index}
                value={metric.value}
                suffix={metric.suffix}
                label={metric.label}
                delay={metric.delay}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

