'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HiArrowRight, HiX } from 'react-icons/hi';
import { MdBugReport } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

const GOOGLE_SHEETS_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;
const OWASP_YELLOW = '#f7c600';

const infoCards = [
  {
    title: 'Parent Org',
    body: 'Open Web Application Security Project (OWASP) - global non-profit. KAMLEWA hosts a recognised local chapter.',
  },
  {
    title: 'Focus',
    body: 'Secure software development, web application security, and open-source security tooling.',
  },
  {
    title: 'Activity Types',
    body: 'Technical discussions, project contributions, security training, and OWASP Top 10 workshops.',
  },
];

const activityItems = [
  'Technical discussions and chapter meetups',
  'OWASP Top 10 workshops',
  'Secure software development training',
  'Open-source security tool contributions',
  'Web application security sessions',
  'Developer and student security education',
];

const navigationLinks = [
  { href: '/community', label: 'Back to Community' },
  { href: '/kamcyber', label: 'KamCyber' },
  { href: '/hackthebox', label: 'HackTheBox' },
];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function ZigzagLine({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 260 28"
      fill="none"
      aria-hidden="true"
      className={className}
      initial={{ opacity: 0.25 }}
      animate={{ opacity: [0.25, 0.85, 0.25] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.path
        d="M2 14 L22 2 L42 26 L62 2 L82 26 L102 2 L122 26 L142 2 L162 26 L182 2 L202 26 L222 2 L242 26 L258 14"
        stroke={OWASP_YELLOW}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  );
}

function FloatingBug({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute text-yellow-400/25 ${className}`}
      animate={{ y: [0, -14, 0], rotate: [0, 8, -8, 0], opacity: [0.18, 0.45, 0.18] }}
      transition={{ duration: 5, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <MdBugReport className="h-12 w-12 md:h-16 md:w-16" />
    </motion.div>
  );
}

export default function OwaspPage() {
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
              community: 'OWASP Buea',
              name: form.name,
              email: form.email,
              phone: form.phone,
              message: form.message,
            }),
          })
        : Promise.resolve(),

      supabase.from('community_applications').insert({
        community: 'OWASP Buea',
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
              <p className="text-yellow-400 text-sm font-semibold uppercase tracking-wider mb-1">Join</p>
              <h2 className="text-2xl font-bold mb-1">OWASP Buea Community</h2>
              <p className="text-gray-400 text-sm mb-6">Fill in your details and we will get back to you shortly.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  required
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm"
                />
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm"
                />
                <input
                  placeholder="Phone (optional)"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm"
                />
                <textarea
                  placeholder="Why do you want to join? (optional)"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-sm resize-none"
                />
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-white/20 text-white text-sm hover:bg-white hover:text-black transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-yellow-400 text-black font-bold text-sm hover:bg-white transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative min-h-[36rem] md:min-h-[42rem] overflow-hidden">
        <Image src="/images/partners/owasp_logo.png" alt="OWASP Buea" fill className="object-cover opacity-35" unoptimized />
        <div className="absolute inset-0 bg-black/85" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(100, 100, 100, 0.97)_0%,rgba(71, 71, 71, 0.84)_52%,rgba(62, 61, 61, 0.42)_100%)]" />
        <Image
          src="/images/partners/owasp_logo.png"
          alt=""
          width={760}
          height={760}
          aria-hidden="true"
          className="absolute right-[-8rem] top-28 z-[1] h-[28rem] w-[28rem] object-contain opacity-[0.08] md:right-[-5rem] md:top-20 md:h-[38rem] md:w-[38rem] lg:right-[-2rem] lg:h-[44rem] lg:w-[44rem]"
          unoptimized
        />
        <FloatingBug className="right-[8%] top-[28%]" />
        <FloatingBug className="right-[22%] bottom-[18%]" delay={1.2} />
        <FloatingBug className="left-[48%] top-[18%] hidden lg:block" delay={2.1} />

        <div className="relative z-10 mx-auto flex min-h-[36rem] md:min-h-[42rem] max-w-7xl items-center px-6 pt-40 pb-16 md:px-12 md:pt-44 md:pb-20 lg:px-16 lg:pt-48">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <p className="text-yellow-400 text-xs md:text-sm font-semibold uppercase tracking-wider mb-5">KAMLEWA Community</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05]">OWASP Buea Chapter</h1>
            <p className="text-yellow-400 font-semibold mt-8 text-lg md:text-xl">Secure code. Stronger web applications. Open knowledge.</p>
            <p className="text-gray-200 text-base md:text-lg leading-8 mt-6 max-w-2xl">
              A recognised local OWASP chapter hosted by KAMLEWA, focused on secure software development, web application
              security, and practical open-source security tooling.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)] gap-8 lg:gap-14 px-6 md:px-12 lg:px-16 py-12 md:py-20 items-start">
        <div className="flex flex-col space-y-8">
          <div className="bg-white text-black rounded-lg p-6 md:p-8 shadow-lg">
            <p className="text-[#8a7000] text-sm font-bold uppercase tracking-wider mb-2">Application Security Community</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-5 text-black">OWASP Buea Chapter</h2>
            <div className="space-y-4 text-base leading-relaxed text-gray-800">
              <p>
                OWASP Buea, led by Ramsey Ibe, is the application security-focused community KAMLEWA actively engages with and
                supports in Cameroon&apos;s Silicon Mountain. As part of the global OWASP network, this community improves software
                security through awareness, education, collaboration, and open-source tools.
              </p>
              <p>
                KAMLEWA collaborates closely with OWASP Buea to organize meetups, workshops, and training sessions that equip
                developers, security professionals, and students with the knowledge to build and maintain secure applications.
              </p>
            </div>
            <p className="text-base leading-relaxed text-gray-800 mt-5">
              Official chapter:{' '}
              <a
                href="https://owasp.org/www-chapter-buea"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8a7000] font-semibold underline hover:text-black transition-colors"
              >
                owasp.org &rarr;
              </a>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {infoCards.map((item) => (
              <div
                key={item.title}
                className="border border-yellow-400/35 bg-yellow-400/5 p-5"
              >
                <motion.p
                  whileHover={{ color: '#ffffff', x: 6 }}
                  className="w-fit cursor-default text-yellow-400 font-semibold uppercase tracking-wider text-xs mb-3 transition-colors"
                >
                  {item.title}
                </motion.p>
                <motion.p
                  whileHover={{ color: '#ffffff', x: 6 }}
                  className="cursor-default text-sm leading-relaxed text-gray-300"
                >
                  {item.body}
                </motion.p>
              </div>
            ))}
          </div>

          <div className="bg-white/[0.03] border border-white/10 p-6">
            <div className="flex items-center gap-4 mb-5">
              <p className="text-yellow-400 font-semibold uppercase tracking-wider">Activity Types</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activityItems.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <MdBugReport className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />
                  <span className="text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <motion.button
            onClick={() => setIsModalOpen(true)}
            whileHover={{ backgroundColor: '#ffffff', color: '#000000', y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-yellow-400 text-black font-bold px-8 py-3 transition-colors w-full lg:w-auto"
          >
            Join OWASP Buea Community
          </motion.button>
        </div>

        <div className="flex flex-col space-y-8">
          <motion.div
            className="bg-yellow-400/10 border border-yellow-400/25 rounded-lg p-8 flex items-center justify-center shadow-2xl"
            animate={{ boxShadow: ['0 0 0 rgba(250,204,21,0)', '0 0 40px rgba(250,204,21,0.18)', '0 0 0 rgba(250,204,21,0)'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image
              src="/images/partners/owasp_logo.png"
              alt="OWASP Buea Logo"
              width={300}
              height={300}
              className="mx-auto rounded-lg"
              unoptimized
            />
          </motion.div>

          <div className="bg-white text-black p-6 rounded-lg">
            <p className="text-[#8a7000] font-semibold text-sm uppercase tracking-wider mb-2">Notable Activity</p>
            <h3 className="text-xl font-bold leading-snug mb-3">OWASP Top 10 2025 at UB-CSC</h3>
            <p className="text-gray-800 text-sm leading-relaxed">
              In 2025, the KAMLEWA team delivered a presentation on OWASP Top 10 2025 for web applications at the University
              of Buea Cybersecurity Club (UB-CSC) event. The session covered vulnerability demystification and practical
              defence strategies.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6">
            <p className="text-yellow-400 font-semibold text-sm uppercase tracking-wider mb-2">Our Impact</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Through OWASP Buea, KAMLEWA is helping build a generation of security-conscious developers in Cameroon where
              security is treated as a foundation from the first line of code.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-black px-6 md:px-16 pb-10">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5">
          <div className="flex justify-center items-end gap-3">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.4, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="w-12 md:w-16 h-12 md:h-16 border-4 border-gray-700 rotate-45 mb-2" />
                <div className="w-10 md:w-14 h-10 md:h-14 bg-yellow-400 rotate-45" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-white/10">
        {navigationLinks.map((item) => (
          <Link key={item.href} href={item.href} className="group p-6 text-center border-r border-white/10 last:border-r-0">
            <motion.span
              whileHover={{ color: '#ffffff', y: -2 }}
              className="mx-auto inline-flex flex-col items-center gap-2 text-yellow-400 font-semibold text-sm"
            >
              <span className="inline-flex items-center gap-2">
                {item.label}
                <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <ZigzagLine className="h-4 w-32 opacity-70 transition-opacity group-hover:opacity-100" />
            </motion.span>
          </Link>
        ))}
      </div>
    </section>
  );
}
