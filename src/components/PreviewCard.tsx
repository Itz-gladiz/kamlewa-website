import Image from 'next/image';
import { Link } from '@/i18n/routing';
import type { MouseEvent } from 'react';
import { HiArrowRight, HiOutlineCalendarDateRange, HiAcademicCap } from 'react-icons/hi2';
import { VscLocation } from 'react-icons/vsc';
import { PiClockCountdownFill } from 'react-icons/pi';
import { motion } from 'framer-motion';

type Item = {
  id?: string | number;
  image: string;
  title: string;
  description: string;
  date?: string;
  location?: string;
  time?: string;
  duration?: string;
  level?: string;
  status?: string;
};

type TranslationFn = (key: string) => string;
type LinkClickEvent = MouseEvent<HTMLAnchorElement>;

export function ProgramCard({ item, index, isActive, onToggle }: { item: Item; index: number; isActive: boolean; onToggle: () => void }) {
  return (
    <motion.div
      key={`program-${index}`}
      className="relative h-64 md:h-80 overflow-hidden group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={onToggle}
    >
      <div className="absolute inset-0">
        <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className={`absolute inset-0 transition-colors duration-300 ${isActive ? 'bg-black/70' : 'bg-black/40 group-hover:bg-black/70'}`}></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
          {item.title}
        </h3>
      </div>

      <div className={`absolute inset-0 bg-black/90 p-6 flex flex-col justify-center transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <h3 className="text-xl md:text-2xl font-bold text-yellow-400 mb-4" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>{item.title}</h3>
        <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">{item.description}</p>
        <Link href={item.id ? `/events-impact/programs/${item.id}` : '/events-impact'} className="tagline inline-flex items-center gap-2 text-yellow-400 font-semibold text-base md:text-2xl hover:text-yellow-300 transition-colors relative group/link pb-2" onClick={(e: LinkClickEvent) => e.stopPropagation()}>
          <span className="relative">
            View Program
            <svg className="absolute -bottom-1 left-0 w-full" preserveAspectRatio="none" viewBox="0 0 200 10" style={{ height: '6px' }}>
              <path d="M0,8 L10,2 L20,8 L30,2 L40,8 L50,2 L60,8 L70,2 L80,8 L90,2 L100,8 L110,2 L120,8 L130,2 L140,8 L150,2 L160,8 L170,2 L180,8 L190,2 L200,8" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </span>
          <HiArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover/link:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}

export function PreviewCard({ item, index, activeTab, tEvents }: { item: Item; index: number; activeTab: string; tEvents: TranslationFn }) {
  return (
    <motion.div
      key={`${activeTab}-${index}`}
      className="relative bg-white/5 overflow-hidden group cursor-pointer border border-white/10 hover:border-yellow-400/50 transition-all duration-300 flex flex-col h-full md:h-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="relative h-48 md:h-56 overflow-hidden">
        <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300"></div>
      </div>

      <div className="p-6 flex flex-col h-full">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 line-clamp-2" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
          {item.title}
        </h3>
        <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4 line-clamp-3 shrink-0">{item.description}</p>

        <div className="flex flex-wrap items-center gap-3 mb-4 shrink-0 text-sm">
          {item.date && (
            <div className="flex items-center gap-1.5 text-yellow-400">
              <HiOutlineCalendarDateRange className="w-4 h-4 shrink-0 text-yellow-400" />
              <span className="whitespace-nowrap">{item.date}</span>
            </div>
          )}
          {item.location && (
            <div className="flex items-center gap-1.5 text-gray-400">
              <VscLocation className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{item.location}</span>
            </div>
          )}
          {item.time && (
            <div className="flex items-center gap-1.5 text-gray-400">
              <PiClockCountdownFill className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{item.time}</span>
            </div>
          )}
          {item.duration && (
            <div className="flex items-center gap-1.5 text-yellow-400">
              <PiClockCountdownFill className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{item.duration}</span>
            </div>
          )}
          {item.level && (
            <div className="flex items-center gap-1.5 text-gray-400">
              <HiAcademicCap className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{item.level}</span>
            </div>
          )}
          {item.status && (
            <div className="inline-block px-3 py-1 bg-yellow-400/20 text-yellow-400 text-xs font-semibold rounded-full whitespace-nowrap">{item.status}</div>
          )}
        </div>

        {(activeTab === 'featured' || activeTab === 'upcoming') && item.id ? (
          <Link href={`/events-impact/${item.id}`} className="tagline inline-flex items-center gap-2 text-yellow-400 font-semibold text-base md:text-2xl hover:text-yellow-300 transition-colors group/link mt-auto" onClick={(e: LinkClickEvent) => e.stopPropagation()}>
            <span className="relative">
              Register Now
              <svg className="absolute -bottom-1 left-0 w-full" preserveAspectRatio="none" viewBox="0 0 200 10" style={{ height: '6px' }}>
                <path d="M0,8 L10,2 L20,8 L30,2 L40,8 L50,2 L60,8 L70,2 L80,8 L90,2 L100,8 L110,2 L120,8 L130,2 L140,8 L150,2 L160,8 L170,2 L180,8 L190,2 L200,8" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </span>
            <HiArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
        ) : (
          <Link href={item.id && activeTab === 'projects' ? `/events-impact/projects/${item.id}` : item.id && activeTab === 'trainings' ? `/events-impact/trainings/${item.id}` : '/events-impact'} className="tagline inline-flex items-center gap-2 text-yellow-400 font-semibold text-base md:text-2xl hover:text-yellow-300 transition-colors group/link mt-auto" onClick={(e: LinkClickEvent) => e.stopPropagation()}>
            <span className="relative">
              {tEvents('learnMore')}
              <svg className="absolute -bottom-1 left-0 w-full" preserveAspectRatio="none" viewBox="0 0 200 10" style={{ height: '6px' }}>
                <path d="M0,8 L10,2 L20,8 L30,2 L40,8 L50,2 L60,8 L70,2 L80,8 L90,2 L100,8 L110,2 L120,8 L130,2 L140,8 L150,2 L160,8 L170,2 L180,8 L190,2 L200,8" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </span>
            <HiArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}
