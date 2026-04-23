'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Input from './Input';
import Button from './Button';

export default function Footer() {
  const t = useTranslations('footer');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const loadingToast = toast.loading(t('newsletterSubmitting'));

    // Simulate API call - replace with actual newsletter subscription endpoint
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(t('newsletterSuccess'), { id: loadingToast });
      setEmail('');
    } catch (error) {
      toast.error(t('newsletterError'), { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center mb-4 hover:opacity-90 transition-opacity">
              <div className="relative w-8 h-12 md:w-8 md:h-16 shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Kamlewa Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col ml-3 md:ml-4">
                <h2 className="text-lg md:text-xl font-bold text-white uppercase" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                  Kamlewa Technologies
                </h2>
                <p className="tagline text-yellow-400 text-xs md:text-sm font-semibold">
                  Innovating Cyber Safety & Inspiring Growth
                </p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-md mb-6">
              {t('description')}
            </p>
            
            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('newsletterTitle')}</h3>
              <p className="text-gray-400 text-sm mb-4">{t('newsletterDescription')}</p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('newsletterPlaceholder')}
                  required
                  className="flex-1"
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="text-sm whitespace-nowrap disabled:opacity-50  disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t('newsletterSubmitting') : t('newsletterSubscribe')}
                </Button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm md:text-base">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href="/events-impact" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm md:text-base">
                  {t('events')}
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm md:text-base">
                  {t('community')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm md:text-base">
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('contact')}</h3>
            <ul className="space-y-2 text-gray-400 text-sm md:text-base">
              <li>
                <a href="mailto:contact@kamlewa.com" className="hover:text-yellow-400 transition-colors">
                  {t('email')}
                </a>
              </li>
              <li>
                <a href="tel:+123456789" className="hover:text-yellow-400 transition-colors">
                  {t('phone')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            {t('copyright')}
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
              {t('privacy')}
            </a>
            <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
              {t('terms')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

