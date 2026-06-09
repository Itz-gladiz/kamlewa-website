'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HiArrowRight, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

const GOOGLE_SHEETS_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;
const KAMCYBER_YELLOW = '#facc15';

const infoCards = [
  {
    title: 'Community Role',
    body: "KAMLEWA's flagship cybersecurity community - the primary brand-facing community.",
  },
  {
    title: 'Focus',
    body: 'Cybersecurity awareness, training, and professional development.',
  },
  {
    title: 'Activity Types',
    body: 'Workshops, training sessions, networking events, and mentorship.',
  },
];

const keyActivities = [
  'Cybersecurity awareness programs',
  'Workshops and training sessions',
  'Professional development support',
  'Networking events',
  'Mentorship for new learners',
  '90 Days Cybersecurity Challenge',
];

const navigationLinks = [
  { href: '/community', label: 'Back to Community' },
  { href: '/hackthebox', label: 'HackTheBox' },
  { href: '/owasp', label: 'OWASP' },
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
      initial={{ opacity: 0.3 }}
      animate={{ opacity: [0.3, 0.95, 0.3] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.path
        d="M2 14 L22 2 L42 26 L62 2 L82 26 L102 2 L122 26 L142 2 L162 26 L182 2 L202 26 L222 2 L242 26 L258 14"
        stroke={KAMCYBER_YELLOW}
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

export default function KamCyberPage() {
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
              community: 'KamCyber',
              name: form.name,
              email: form.email,
              phone: form.phone,
              message: form.message,
            }),
          })
        : Promise.resolve(),

      supabase.from('community_applications').insert({
        community: 'KamCyber',
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
              <h2 className="text-2xl font-bold mb-1">KamCyber Community</h2>
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
        <Image src="/images/kamcyber.png" alt="KamCyber" fill className="object-cover opacity-45" unoptimized />
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15, 14, 14, 0.97)_0%,rgba(24, 22, 22, 0.82)_52%,rgba(6, 4, 4, 0.35)_100%)]" />
        <Image
          src="/images/kamcyber2.png"
          alt=""
          width={760}
          height={760}
          aria-hidden="true"
          className="absolute right-[-8rem] top-24 z-[1] h-[28rem] w-[28rem] object-contain opacity-[0.09] md:right-[-5rem] md:top-16 md:h-[38rem] md:w-[38rem] lg:right-[-2rem] lg:h-[44rem] lg:w-[44rem]"
          unoptimized
        />

      
  
    {/* Animated underline effect */}
    <div className="relative z-10 mx-auto flex min-h-[36rem] md:min-h-[42rem] max-w-7xl items-center px-6 pt-40 pb-16 md:px-12 md:pt-44 md:pb-20 lg:px-16 lg:pt-48">
  <motion.div
    className="max-w-3xl"
    initial={{ opacity: 0, y: 28 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
  >
    {/* Animated underline effect */}
    <div className="relative inline-block mb-5 group">
      <p className="text-yellow-400 text-xs md:text-sm font-semibold uppercase tracking-wider">
        KAMLEWA Community
      </p>
      <motion.div
        className="absolute left-0 bottom-0 h-[2px] bg-yellow-400"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        whileHover={{ width: 0 }}
      />
    </div>

    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05]">
      KamCyber
    </h1>
    <p className="text-yellow-400 font-semibold mt-8 text-lg md:text-xl">
      Cybersecurity awareness. Training. Professional growth.
    </p>
    <p className="text-gray-200 text-base md:text-lg leading-8 mt-6 max-w-2xl">
      KAMLEWA&apos;s flagship cybersecurity community and primary brand-facing community for learners, professionals,
      mentors, and partners building stronger cybersecurity capacity together.
    </p>
  </motion.div>
</div>
      </div>
      

      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)] gap-8 lg:gap-14 px-6 md:px-12 lg:px-16 py-12 md:py-20 items-start">
        <div className="flex flex-col space-y-8">
          <div className="bg-white text-black rounded-lg p-6 md:p-8 shadow-lg">
            <p className="text-[#8a7000] text-sm font-bold uppercase tracking-wider mb-2">Flagship Cybersecurity Community</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-5 text-black">KAMLEWA&apos;s Primary Brand-Facing Community</h2>
            <div className="space-y-4 text-base leading-relaxed text-gray-800">
              <p>
                KAMCYBER is KAMLEWA&apos;s first and flagship cybersecurity community, established to create a supportive
                environment for anyone eager to learn, practice, and grow in the cybersecurity field.
              </p>
              <p>
                Through programs like the 90 Days Cybersecurity Challenge, workshops, training sessions, networking events,
                and mentorship, KAMCYBER helps members build practical skills and connect with professional opportunities.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {infoCards.map((item) => (
              <div key={item.title} className="border border-yellow-400/35 bg-yellow-400/5 p-5">
                <motion.p
                  whileHover={{ color: '#ffffff', x: 6 }}
                  className="w-fit cursor-default text-yellow-400 font-semibold uppercase tracking-wider text-xs mb-3"
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="border border-white/10 p-5 bg-white/[0.03]">
              <p className="text-3xl font-black text-yellow-400">400+</p>
              <p className="text-gray-400 text-sm mt-2">Active members</p>
            </div>
            <div className="border border-white/10 p-5 bg-white/[0.03]">
              <p className="text-3xl font-black text-yellow-400">10+</p>
              <p className="text-gray-400 text-sm mt-2">Certified members</p>
            </div>
            <div className="border border-white/10 p-5 bg-white/[0.03]">
              <p className="text-3xl font-black text-yellow-400">Flagship</p>
              <p className="text-gray-400 text-sm mt-2">KAMLEWA community</p>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 p-6">
            <p className="text-yellow-400 font-semibold uppercase tracking-wider mb-5">Key Activities</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {keyActivities.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-yellow-400" />
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
            Join KamCyber
          </motion.button>
        </div>

        <div className="flex flex-col space-y-8">
          <motion.div
            className="bg-yellow-400 rounded-lg p-8 flex items-center justify-center shadow-2xl"
            animate={{ boxShadow: ['0 0 0 rgba(250,204,21,0)', '0 0 40px rgba(250,204,21,0.2)', '0 0 0 rgba(250,204,21,0)'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image src="/images/kamcyber2.png" alt="KamCyber Logo" width={300} height={300} className="mx-auto rounded-lg" unoptimized />
          </motion.div>

          <div className="bg-white text-black p-6 rounded-lg">
            <p className="text-[#8a7000] font-semibold text-sm uppercase tracking-wider mb-2">Professional Development</p>
            <h3 className="text-xl font-bold leading-snug mb-3">A Cybersecurity Growth Hub</h3>
            <p className="text-gray-800 text-sm leading-relaxed">
              KAMCYBER connects training, peer learning, mentorship, and community events so members can move from awareness
              to practical skill development and career readiness.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6">
            <p className="text-yellow-400 font-semibold text-sm uppercase tracking-wider mb-2">Our Impact</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Today, with over 400 active members, KAMCYBER stands as KAMLEWA&apos;s largest specialized cybersecurity forum
              and a proof of what happens when passionate learners, mentors, and professionals build together.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-black px-6 md:px-16 pb-10">
        <div className="mx-auto flex max-w-4xl justify-center items-end gap-3">
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
