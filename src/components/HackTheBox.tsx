'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

const GOOGLE_SHEETS_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HackTheBoxPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
await Promise.allSettled([
      // Google Sheets
      GOOGLE_SHEETS_URL
        ? fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sheetName: 'Community Applications',
              community: 'HackTheBox',
              name: form.name,
              email: form.email,
              phone: form.phone,
              message: form.message,
            }),
          })
        : Promise.resolve(),

      // Supabase
      supabase.from('community_applications').insert({
        community: 'HackTheBox',
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      }),
    ]);

    setIsSubmitting(false);
    setIsModalOpen(false);
    setForm({ name: '', email: '', phone: '', message: '' });
    alert('Application submitted! We will get back to you soon.');
  };

  return (
    <section className="bg-black text-white overflow-hidden">

      {/* Join Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="relative bg-[#111] border border-white/10 w-full max-w-md p-8"
            >
              <button
                title="Close"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <HiX className="w-6 h-6" />
              </button>
              <p className="text-yellow-400 text-sm font-semibold uppercase tracking-wider mb-1">Join</p>
              <h2 className="text-2xl font-bold mb-1">HackTheBox Community</h2>
              <p className="text-gray-400 text-sm mb-6">Fill in your details and we will get back to you shortly.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  required
                  placeholder="Full Name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm"
                />
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm"
                />
                <input
                  placeholder="Phone (optional)"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm"
                />
                <textarea
                  placeholder="Why do you want to join? (optional)"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm resize-none"
                />
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-white/20 text-white text-sm hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Banner */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden">
        <Image src="/images/partners/hackthebox.png" alt="HackTheBox" fill className="object-cover" unoptimized />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-center px-6 md:px-16">
          <div>
            <p className="text-yellow-400 text-sm font-semibold uppercase tracking-wider mb-2">KAMLEWA Community</p>
            <h1 className="text-4xl md:text-6xl font-black text-white">HACK THE BOX</h1>
            <p className="text-yellow-400 font-semibold mt-2">Hack. Learn. Grow. Together.</p>
          </div>
        </div>
      </div>

      {/* Back to Community */}
      <div className="px-6 md:px-16 pt-6">
        <Link href="/community">
          <button className="text-yellow-400 text-sm font-semibold hover:text-yellow-300 transition-colors flex items-center gap-2">
            ← Back to Community
          </button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 px-6 md:px-10 lg:px-16 py-12 md:py-20 items-start">

        {/* Left — Info */}
        <div className="flex flex-col space-y-6">
          <div className="bg-white text-black rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-yellow-500">HACK THE BOX</h2>
            <p className="text-base leading-relaxed text-gray-800">
              HackTheBox Cameroon is KAMLEWA's offensive security community, founded after our President, Mbangni Quince Tse, became the official HackTheBox Ambassador for Cameroon. Focused on hands-on, practical hacking skills through gamified labs and real-world simulations, it has grown to become our most active cybersecurity community.
            </p>
            <p className="text-base leading-relaxed text-gray-800 mt-3">
              Through regular meetups and fueling major events like 237HackFest and the First Cybersecurity End of Year Meetup, this community has brought world-class cybersecurity training and practical upskilling directly to the doorsteps of Cameroonians — delivering over 1,000+ hours of hands-on training to aspiring penetration testers and ethical hackers across the country.
            </p>
            <p className="text-base leading-relaxed text-gray-800 mt-3">
              A flagship program is the <span className="font-semibold">SECLevelUp Initiative</span> — an intensive 2+ month program designed to prepare participants for industry-leading certifications like CPTS and CDSA. Participants receive structured learning paths, curated resources, mentorship, and even exam vouchers.
            </p>
            {/* Website link */}
            <p className="text-base leading-relaxed text-gray-800 mt-4">
              Find more on the official website:{' '}
              <a
                href="https://www.hackthebox.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-500 font-semibold underline hover:text-yellow-400 transition-colors"
              >
                hackthebox.com →
              </a>
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-yellow-400/30 p-4 bg-yellow-400/5">
              <p className="text-3xl font-black text-yellow-400">1,000+</p>
              <p className="text-gray-400 text-sm mt-1">Hours of Training</p>
            </div>
            <div className="border border-yellow-400/30 p-4 bg-yellow-400/5">
              <p className="text-3xl font-black text-yellow-400">Active</p>
              <p className="text-gray-400 text-sm mt-1">Community Hub</p>
            </div>
          </div>

          {/* Key Activities */}
          <div>
            <p className="text-yellow-400 font-semibold uppercase tracking-wider mb-3">Key Activities</p>
            <div className="space-y-2">
              {[
                'SECLevelUp Initiative (CPTS & CDSA prep)',
                'CTF Competitions & Gamified Labs',
                '237HackFest & Major Meetups',
                'Penetration Testing Workshops',
                'Mentorship & Exam Voucher Support',
                'Real-World Hacking Simulations',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="text-yellow-400 font-bold mt-1">•</span>
                  <span className="text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-yellow-400 text-black font-bold px-8 py-3 hover:bg-yellow-300 transition-colors w-full lg:w-auto"
          >
            Join HackTheBox Community
          </button>
        </div>

        {/* Right — Logo + Impact */}
        <div className="flex flex-col space-y-6">
          <div className="bg-black rounded-2xl p-8 flex items-center justify-center shadow-2xl">
            <Image
              src="/images/partners/hackthebox.png"
              alt="HackTheBox Logo"
              width={300}
              height={300}
              className="mx-auto rounded-xl"
              unoptimized
            />
          </div>
          <div className="bg-white/5 border border-white/10 p-6">
            <p className="text-yellow-400 font-semibold text-sm uppercase tracking-wider mb-2">Our Impact</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              HackTheBox Cameroon stands as KAMLEWA's most active cybersecurity community, closing the gap between ambition and achievement for Cameroonian cybersecurity talent — and putting Cameroon on the global offensive security map.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Pattern */}
      <div className="bg-black px-6 md:px-16 pb-8">
        <div className="flex justify-center items-end gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-12 md:w-16 h-12 md:h-16 border-4 border-gray-700 rotate-45 mb-2" />
              <div className="w-10 md:w-14 h-10 md:h-14 bg-yellow-400 rotate-45" />
            </div>
          ))}
        </div>
      </div>

      {/* Redirect Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-white/10">
        <Link href="/community" className="p-6 hover:bg-white/5 transition-colors text-center border-r border-white/10">
          <p className="text-yellow-400 font-semibold text-sm">← Back to Community</p>
        </Link>
        <Link href="/kamcyber" className="p-6 hover:bg-white/5 transition-colors text-center border-r border-white/10">
          <p className="text-yellow-400 font-semibold text-sm">← KamCyber</p>
        </Link>
        <Link href="/owasp" className="p-6 hover:bg-white/5 transition-colors text-center">
          <p className="text-yellow-400 font-semibold text-sm">OWASP →</p>
        </Link>
      </div>
    </section>
  );
}