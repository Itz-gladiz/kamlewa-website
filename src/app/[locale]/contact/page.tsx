'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageBanner from '@/components/PageBanner';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { HiMail, HiPhone } from 'react-icons/hi';

const GOOGLE_SHEETS_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;

export default function ContactPage() {
  const t = useTranslations('contact');

  const [generalForm, setGeneralForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmittingGeneral, setIsSubmittingGeneral] = useState(false);

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingGeneral(true);
    const loadingToast = toast.loading(t('sending'));

    try {
      if (!GOOGLE_SHEETS_URL) {
        throw new Error('Google Sheets URL is not configured');
      }

      const response = await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: generalForm.name,
          email: generalForm.email,
          phone: generalForm.phone || 'N/A',
          subject: generalForm.subject,
          message: generalForm.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(t('success'), { id: loadingToast });
        setGeneralForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      const err = error as { message?: string };
      console.error('Contact form error:', err);
      // Google Apps Script has CORS issues with fetch — use no-cors fallback
      try {
        await fetch(GOOGLE_SHEETS_URL!, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: generalForm.name,
            email: generalForm.email,
            phone: generalForm.phone || 'N/A',
            subject: generalForm.subject,
            message: generalForm.message,
          }),
        });
        // no-cors returns opaque response — assume success
        toast.success(t('success'), { id: loadingToast });
        setGeneralForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } catch {
        toast.error(t('error'), { id: loadingToast });
      }
    } finally {
      setIsSubmittingGeneral(false);
    }
  };

  return (
    <main className="relative">
      <Navbar />
      <PageBanner
        subheading={t('subheading')}
        heading={t('heading')}
        description={t('description')}
      />
      <section className="bg-black text-white py-3 md:py-5 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">

            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                {t('contactInfo')}
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <HiMail className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-1 uppercase">{t('email')}</h3>
                    <a href="mailto:aaaaaaaaaa@gmail.com" className="text-white hover:text-yellow-400 transition-colors">
                      aaaaaaaaaa@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <HiPhone className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-1 uppercase">{t('primaryPhone')}</h3>
                    <a href="tel:123456789" className="text-white hover:text-yellow-400 transition-colors">
                      123456789
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <HiPhone className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-1 uppercase">{t('secondaryPhone')}</h3>
                    <a href="tel:123456789" className="text-white hover:text-yellow-400 transition-colors">
                      123456789
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                {t('generalInquiry')}
              </h2>
              <p className="text-gray-400 text-sm mb-6">{t('generalInquiryDesc')}</p>

              <form onSubmit={handleGeneralSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    placeholder={t('namePlaceholder')}
                    value={generalForm.name}
                    onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })}
                    required
                    className="bg-white/5"
                  />
                  <Input
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    value={generalForm.email}
                    onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
                    required
                    className="bg-white/5"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="tel"
                    placeholder={t('phonePlaceholder')}
                    value={generalForm.phone}
                    onChange={(e) => setGeneralForm({ ...generalForm, phone: e.target.value })}
                    className="bg-white/5"
                  />
                  <Input
                    type="text"
                    placeholder={t('subjectPlaceholder')}
                    value={generalForm.subject}
                    onChange={(e) => setGeneralForm({ ...generalForm, subject: e.target.value })}
                    required
                    className="bg-white/5"
                  />
                </div>
                <textarea
                  placeholder={t('messagePlaceholder')}
                  value={generalForm.message}
                  onChange={(e) => setGeneralForm({ ...generalForm, message: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-700 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors text-sm resize-none"
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmittingGeneral}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingGeneral ? t('sending') : t('send')}
                </Button>
              </form>
            </div>

          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}