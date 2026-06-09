'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

const GOOGLE_SHEETS_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;
const focusAreas = [
  {
    title: 'Focus',
    body: 'Hands-on ethical hacking, offensive security, defensive security, and practical skills development.',
  },
  {
    title: 'Activity Types',
    body: 'CTF competitions, lab exercises, skill-building sessions, and guided learning paths.',
  },
  {
    title: 'Partnership Confirmed',
    body: 'Hack The Box is listed as an official KAMLEWA partner on kamlewa.org.',
  },
];

const keyActivities = [
  {
    title: 'CTF Competitions',
    body: 'Capture The Flag challenges for practical offensive security practice.',
  },
  {
    title: 'Hands-on Labs',
    body: 'Guided lab exercises that turn concepts into repeatable technical skills.',
  },
  {
    title: 'Skill-building Sessions',
    body: 'Focused sessions for ethical hacking, defence, and security fundamentals.',
  },
  {
    title: 'Guided Learning Paths',
    body: 'Structured paths that help learners progress with clarity and momentum.',
  },
  {
    title: 'SECLevelUp Initiative',
    body: 'CPTS and CDSA preparation with curated resources and mentorship support.',
  },
  {
    title: 'Security Workshops',
    body: 'Offensive and defensive workshops built around real-world techniques.',
  },
];

const stats = [
  { value: '1,000+', label: 'Hours of hands-on training' },
  { value: '234', label: 'Discord community members' },
  { value: 'Active', label: 'MeetUp and learning hub' },
];

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
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false);
            }}
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
              <p className="text-[#9fef00] text-sm font-semibold uppercase tracking-wider mb-1">Join</p>
              <h2 className="text-2xl font-bold mb-1">HackTheBox Community</h2>
              <p className="text-gray-400 text-sm mb-6">Fill in your details and we will get back to you shortly.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  required
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#9fef00] text-sm"
                />
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#9fef00] text-sm"
                />
                <input
                  placeholder="Phone (optional)"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#9fef00] text-sm"
                />
                <textarea
                  placeholder="Why do you want to join? (optional)"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#9fef00] text-sm resize-none"
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
                    className="flex-1 px-4 py-2 bg-[#9fef00] text-black font-bold text-sm hover:bg-[#b8ff35] transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full min-h-[39rem] md:min-h-[46rem] overflow-hidden">
        <Image src="/images/partners/hackthebox.png" alt="HackTheBox" fill className="object-cover" unoptimized />
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(75, 72, 72, 0.96)_0%,rgba(44, 40, 40, 0.78)_45%,rgba(50, 44, 44, 0.35)_100%)]" />
        <div className="relative z-10 mx-auto flex min-h-[39rem] md:min-h-[46rem] max-w-7xl items-center px-6 pt-48 pb-16 md:px-12 md:pt-56 md:pb-20 lg:px-16 lg:pt-60">
          <div className="max-w-3xl">
            <p className="text-[#9fef00] text-xs md:text-sm font-semibold uppercase tracking-wider mb-5">KAMLEWA Community</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05]">Hack The Box Cameroon</h1>
            <p className="text-[#9fef00] font-semibold mt-8 text-lg md:text-xl">Hack. Learn. Defend. Grow together.</p>
            <p className="text-gray-200 text-base md:text-lg leading-8 mt-6 max-w-2xl">
              A structured KAMLEWA partner community for hands-on ethical hacking, offensive and defensive security training,
              CTF practice, and guided cybersecurity skill development.
            </p>
          </div>
        </div>
      </div>
    

      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 pt-8">
        <Link href="/community" className="text-[#9fef00] text-sm font-semibold hover:text-[#b8ff35] transition-colors inline-flex items-center gap-2">
          <span aria-hidden="true">&larr;</span>
          Back to Community
        </Link>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)] gap-8 lg:gap-14 px-6 md:px-12 lg:px-16 py-12 md:py-20 items-start">
        <div className="flex flex-col space-y-8">
          <div className="bg-white text-black rounded-lg p-6 md:p-8 shadow-lg">
            <p className="text-[#5f9600] text-sm font-bold uppercase tracking-wider mb-2">Official Partner Community</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-5 text-black">Hack The Box MeetUp: Cameroun</h2>
            <div className="space-y-4 text-base leading-relaxed text-gray-800">
              <p>
                HackTheBox Cameroon is KAMLEWA&apos;s offensive security community, founded after our President, Mbangni Quince Tse,
                became the official HackTheBox Ambassador for Cameroon. Focused on hands-on, practical hacking skills through
                gamified labs and real-world simulations, it has grown to become our most active cybersecurity community.
              </p>
              <p>
                Through regular meetups and events like 237HackFest and the First Cybersecurity End of Year Meetup, this community
                has brought world-class cybersecurity training and practical upskilling directly to the doorsteps of Cameroonians,
                delivering over 1,000+ hours of hands-on training to aspiring penetration testers and ethical hackers across the country.
              </p>
              <p>
                A flagship program is the <span className="font-semibold">SECLevelUp Initiative</span>, an intensive 2+ month program
                designed to prepare participants for industry-leading certifications like CPTS and CDSA. Participants receive structured
                learning paths, curated resources, mentorship, and even exam vouchers.
              </p>
            </div>
            <p className="text-base leading-relaxed text-gray-800 mt-5">
              Official website:{' '}
              <a
                href="https://www.hackthebox.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5f9600] font-semibold underline hover:text-black transition-colors"
              >
                hackthebox.com &rarr;
              </a>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {focusAreas.map((item) => (
              <div key={item.title} className="border border-[#9fef00]/35 bg-[#9fef00]/5 p-5">
                <p className="text-[#9fef00] font-semibold uppercase tracking-wider text-xs mb-3">{item.title}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {stats.map((stat) => (
              <div key={stat.label} className="border border-white/10 p-5 bg-white/[0.03]">
                <p className="text-3xl font-black text-[#9fef00]">{stat.value}</p>
                <p className="text-gray-400 text-sm mt-2">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/[0.03] border border-white/10 p-6 md:p-7">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[#9fef00] font-semibold uppercase tracking-wider">Key Activities</p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-400">
                  Practical sessions arranged around learning, practice, and community momentum.
                </p>
              </div>
              <motion.div
                aria-hidden="true"
                className="hidden h-1 w-24 bg-[#9fef00] sm:block"
                animate={{ scaleX: [0.35, 1, 0.35], opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {keyActivities.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.45, delay: index * 0.06, ease: 'easeOut' }}
                  whileHover={{ y: -5, borderColor: '#9fef00', backgroundColor: 'rgba(159, 239, 0, 0.1)' }}
                  className="group border border-white/10 bg-black/30 p-5 transition-colors"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <motion.span
                      className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#9fef00] text-sm font-black text-black"
                      animate={{ rotate: [0, 4, -4, 0] }}
                      transition={{ duration: 3, delay: index * 0.15, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </motion.span>
                    <p className="font-semibold text-white transition-colors group-hover:text-[#9fef00]">{item.title}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-400">{item.body}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.button
            onClick={() => setIsModalOpen(true)}
            animate={{ x: [0, -5, 5, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ backgroundColor: '#ffffff', color: '#000000', x: 0 }}
            className="bg-[#9fef00] text-black font-bold px-8 py-3 w-full lg:w-auto"
          >
            Join HackTheBox Community
          </motion.button>
        </div>

        <div className="flex flex-col space-y-8">
          <div className="bg-[#9fef00]/10 border border-[#9fef00]/25 rounded-lg p-8 flex items-center justify-center shadow-2xl">
            <Image
              src="/images/partners/hackthebox.png"
              alt="HackTheBox Logo"
              width={300}
              height={300}
              className="mx-auto rounded-lg"
              unoptimized
            />
          </div>

          <div className="bg-white text-black p-6 rounded-lg">
            <p className="text-[#5f9600] font-semibold text-sm uppercase tracking-wider mb-2">Discord</p>
            <h3 className="text-xl font-bold leading-snug mb-3">Join the HackTheBox MeetUp: Cameroun Discord Server!</h3>
            <p className="text-gray-800 text-sm leading-relaxed mb-5">
              Check out the HackTheBox MeetUp: Cameroun community on Discord. Hang out with 234 other members and enjoy free
              voice and text chat.
            </p>
            <a
              href="https://discord.gg/jd7GbNJx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center bg-black px-5 py-3 text-sm font-bold text-[#9fef00] transition-colors hover:bg-[#1a1a1a] sm:w-auto"
            >
              Open Discord &rarr;
            </a>
          </div>

          <div className="bg-white/5 border border-white/10 p-6">
            <p className="text-[#9fef00] font-semibold text-sm uppercase tracking-wider mb-2">Our Impact</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              HackTheBox Cameroon stands as KAMLEWA&apos;s most active cybersecurity community, closing the gap between ambition
              and achievement for Cameroonian cybersecurity talent and putting Cameroon on the global offensive security map.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-black px-6 md:px-16 pb-8">
        <div className="flex justify-center items-end gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-12 md:w-16 h-12 md:h-16 border-4 border-gray-700 rotate-45 mb-2" />
              <div className="w-10 md:w-14 h-10 md:h-14 bg-[#9fef00] rotate-45" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-white/10">
        <Link href="/community" className="p-6 hover:bg-white/5 transition-colors text-center border-r border-white/10">
          <p className="text-[#9fef00] font-semibold text-sm">&larr; Back to Community</p>
        </Link>
        <Link href="/kamcyber" className="p-6 hover:bg-white/5 transition-colors text-center border-r border-white/10">
          <p className="text-[#9fef00] font-semibold text-sm">&larr; KamCyber</p>
        </Link>
        <Link href="/owasp" className="p-6 hover:bg-white/5 transition-colors text-center">
          <p className="text-[#9fef00] font-semibold text-sm">OWASP &rarr;</p>
        </Link>
      </div>
    </section>
  );
}
