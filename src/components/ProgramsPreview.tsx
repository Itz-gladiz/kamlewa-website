'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowRight, HiCalendar, HiClock, HiAcademicCap, HiLightBulb, HiX } from 'react-icons/hi';
import Image from 'next/image';
import { Link, useRouter } from '@/i18n/routing';
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import { MdOutlineFeaturedPlayList, MdOutlineSwipe } from "react-icons/md";
import { PiGraduationCapBold, PiClockCountdownFill } from "react-icons/pi";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { FaFirstdraft } from "react-icons/fa6";
import { VscLocation } from "react-icons/vsc";
import { getEvents } from '@/lib/supabase/events';
import { mapDbEventToEvent } from '@/utils/eventMapper';
import { Event } from '@/data/events';
import Loader from './Loader';
import toast from 'react-hot-toast';

export default function ProgramsPreview() {
  const t = useTranslations('programs');
  const tEvents = useTranslations('featuredEvents');
  const router = useRouter();
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'programs' | 'featured' | 'upcoming' | 'projects' | 'trainings'>('programs');
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
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

  const programs = [
    {
      title: t('steamClubs'),
      description: t('steamClubsDesc'),
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071',
    },
    {
      title: t('techBootcamps'),
      description: t('techBootcampsDesc'),
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070',
    },
    {
      title: t('cybersafetyTours'),
      description: t('cybersafetyToursDesc'),
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070',
    },
    {
      title: t('startupIncubation'),
      description: t('startupIncubationDesc'),
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070',
    },
  ];

  const tabs = [
    { id: 'programs' as const, label: t('tabs.programs'), icon: FaFirstdraft },
    { id: 'featured' as const, label: tEvents('tabs.featured'), icon: MdOutlineFeaturedPlayList },
    { id: 'upcoming' as const, label: tEvents('tabs.upcoming'), icon: HiOutlineCalendarDateRange },
    { id: 'projects' as const, label: tEvents('tabs.projects'), icon: HiOutlineClipboardDocumentList },
    { id: 'trainings' as const, label: tEvents('tabs.trainings'), icon: PiGraduationCapBold },
  ];

  // Load events from Supabase
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoadingEvents(true);
        const dbEvents = await getEvents();
        const mappedEvents = dbEvents.map(mapDbEventToEvent);
        
        const featured = mappedEvents.filter(e => e.type === 'featured').slice(0, 3);
        const upcoming = mappedEvents.filter(e => e.type === 'upcoming').slice(0, 2);
        
        setFeaturedEvents(featured);
        setUpcomingEvents(upcoming);
      } catch (error) {
        console.error('Error loading events:', error);
        // Fallback to empty arrays on error
        setFeaturedEvents([]);
        setUpcomingEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };
    loadEvents();
  }, []);

  const currentProjects = [
    {
      title: tEvents('projects.project1.title'),
      description: tEvents('projects.project1.description'),
      status: tEvents('projects.project1.status'),
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070',
    },
    {
      title: tEvents('projects.project2.title'),
      description: tEvents('projects.project2.description'),
      status: tEvents('projects.project2.status'),
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070',
    },
  ];

  const trainings = [
    {
      title: tEvents('trainings.training1.title'),
      description: tEvents('trainings.training1.description'),
      duration: tEvents('trainings.training1.duration'),
      level: tEvents('trainings.training1.level'),
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071',
    },
    {
      title: tEvents('trainings.training2.title'),
      description: tEvents('trainings.training2.description'),
      duration: tEvents('trainings.training2.duration'),
      level: tEvents('trainings.training2.level'),
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070',
    },
    {
      title: tEvents('trainings.training3.title'),
      description: tEvents('trainings.training3.description'),
      duration: tEvents('trainings.training3.duration'),
      level: tEvents('trainings.training3.level'),
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070',
    }
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case 'programs':
        return programs;
      case 'featured':
        return featuredEvents;
      case 'upcoming':
        return upcomingEvents;
      case 'projects':
        return currentProjects;
      case 'trainings':
        return trainings;
      default:
        return programs;
    }
  };

  // Check if user has seen swipe hint before
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenHint = localStorage.getItem('hasSeenSwipeHint');
      if (!hasSeenHint) {
        // Show hint after a short delay
        const timer = setTimeout(() => {
          setShowSwipeHint(true);
        }, 2000);
        return () => clearTimeout(timer);
      } else {
        setShowSwipeHint(false);
      }
    }
  }, []);

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      // Dismiss hint if it's showing
      if (showSwipeHint) {
        dismissSwipeHint();
      }
      
      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
      
      if (distance > 0 && currentIndex < tabs.length - 1) {
        // Swipe left - go to next tab
        setActiveTab(tabs[currentIndex + 1].id);
        setActiveCard(null);
      } else if (distance < 0 && currentIndex > 0) {
        // Swipe right - go to previous tab
        setActiveTab(tabs[currentIndex - 1].id);
        setActiveCard(null);
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const dismissSwipeHint = () => {
    setShowSwipeHint(false);
    localStorage.setItem('hasSeenSwipeHint', 'true');
  };

  return (
    <section className="bg-black text-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section Header */}
          <motion.div className="text-left mb-12 md:mb-16" variants={itemVariants}>
            <motion.p
              className="tagline text-yellow-400 text-sm md:text-base font-semibold mb-5 uppercase tracking-wider relative inline-block"
              variants={itemVariants}
            >
              {t('subheading')}
              <span className="absolute bottom-0 left-1/2 md:left-0 transform -translate-x-full md:translate-x-0 w-1/2 h-0.5 bg-yellow-400"></span>
            </motion.p>
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              variants={itemVariants}
              style={{ fontFamily: 'var(--font-nourd), sans-serif' }}
            >
              {t('heading')}
            </motion.h2>
            <motion.p
              className="text-gray-300 text-base md:text-lg max-w-3xl md:max-w-2xl mx-auto md:mx-0"
              variants={itemVariants}
            >
              {t('description')}
            </motion.p>
          </motion.div>

          {/* Material Design Style Tabs */}
          <motion.div 
            className="relative mb-8 md:mb-12 border-b border-white/20" 
            variants={itemVariants}
            role="tablist"
          >
            <div className="relative overflow-hidden">
              {/* Gradient fade on right to indicate more content - only on mobile */}
              <div className="absolute right-0 top-0 bottom-0 w-12 md:w-0 bg-gradient-to-l from-black via-black/80 to-transparent pointer-events-none z-10 md:hidden"></div>
              
              <div className="flex gap-1 overflow-x-auto scrollbar-hide scroll-smooth pb-1 -mr-3 md:mr-0">
                {tabs.map((tab, index) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const isLastTab = index === tabs.length - 1;
                  
                  return (
                    <div key={tab.id} className={`relative shrink-0 ${isLastTab ? 'pr-3 md:pr-0' : ''}`}>
                      {/* Shadow Box - Only for active tab */}
                      {isActive && (
                        <div className="absolute inset-0 bg-white/15 translate-x-1 translate-y-1 md:translate-x-2 md:translate-y-2 "></div>
                      )}
                      
                      {/* Main Tab Button */}
                      <button
                        onClick={() => {
                          setActiveTab(tab.id);
                          setActiveCard(null);
                        }}
                        role="tab"
                        aria-selected={isActive}
                        tabIndex={isActive ? 0 : -1}
                        className={`relative flex items-center gap-2 px-3 md:px-6 py-4 cursor-pointer font-medium text-sm md:text-base transition-all duration-200 ${
                          isActive
                            ? 'bg-yellow-400 text-black'
                            : 'text-white/70 hover:text-white bg-transparent'
                        } `}
                      >
                        <span className="flex items-center gap-2 relative z-10">
                          <Icon className={`w-5 h-5 md:w-5 md:h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                          {/* Show text on desktop always, on mobile only when active */}
                          <span className={`whitespace-nowrap transition-all duration-200 ${
                            isActive ? 'opacity-100 max-w-[200px] md:max-w-none' : 'opacity-0 max-w-0 md:opacity-100 md:max-w-none'
                          } overflow-hidden`}>
                            {tab.label}
                          </span>
                        </span>
                        {/* Underline Indicator */}
                        <span 
                          className={`absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 transition-all duration-300 ease-in-out ${
                            isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                          }`}
                          style={{
                            transformOrigin: 'left center'
                          }}
                        />
                        {/* Ripple effect background */}
                        <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Swipe Hint Tooltip - Mobile only, above content, full width */}
          <AnimatePresence>
            {showSwipeHint && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative w-full mb-4 bg-yellow-400 text-black px-4 py-3 shadow-lg z-20 md:hidden"
              >
                <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                  <MdOutlineSwipe className="w-5 h-5" />
                  <span>{tEvents('swipeHint')}</span>
                  <button
                    onClick={dismissSwipeHint}
                    className="ml-2 hover:bg-black/10 rounded p-1 transition-colors"
                    aria-label="Dismiss hint"
                  >
                    <HiX className="w-4 h-4" />
                  </button>
                </div>
                {/* Sharp triangle indicator pointing down to content */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-transparent border-t-yellow-400"></div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content Grid */}
          {(activeTab === 'featured' || activeTab === 'upcoming') && loadingEvents ? (
            <div className="flex justify-center items-center py-12">
              <Loader />
            </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              ref={contentContainerRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`relative grid gap-6 md:gap-8 mb-12 ${
                activeTab === 'programs' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {getCurrentData().map((item: any, index: number) => {
              const isActive = activeCard === index;
              const isProgramTab = activeTab === 'programs';
              
              if (isProgramTab) {
                return (
                  <motion.div
                    key={`program-${index}`}
                    className="relative h-64 md:h-80 overflow-hidden group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => setActiveCard(isActive ? null : index)}
                  >
                    {/* Image */}
                    <div className="absolute inset-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 transition-colors duration-300 ${isActive ? 'bg-black/70' : 'bg-black/40 group-hover:bg-black/70'}`}></div>
                    </div>

                    {/* Content - Always visible title */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                        {item.title}
                      </h3>
                    </div>

                    {/* Hover Overlay - Description */}
                    <div className={`absolute inset-0 bg-black/90 p-6 flex flex-col justify-center transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <h3 className="text-xl md:text-2xl font-bold text-yellow-400 mb-4" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                        {item.title}
                      </h3>
                      <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
                        {item.description}
                      </p>
                      <Link 
                        href="/events-impact" 
                        className="tagline inline-flex items-center gap-2 text-yellow-400 font-semibold text-base md:text-2xl hover:text-yellow-300 transition-colors relative group/link pb-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="relative">
                          View Program
                          <svg 
                            className="absolute -bottom-1 left-0 w-full" 
                            preserveAspectRatio="none" 
                            viewBox="0 0 200 10"
                            style={{ height: '6px' }}
                          >
                            <path 
                              d="M0,8 L10,2 L20,8 L30,2 L40,8 L50,2 L60,8 L70,2 L80,8 L90,2 L100,8 L110,2 L120,8 L130,2 L140,8 L150,2 L160,8 L170,2 L180,8 L190,2 L200,8" 
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                            />
                          </svg>
                        </span>
                        <HiArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </motion.div>
                );
              } else {
                return (
                  <motion.div
                    key={`${activeTab}-${index}`}
                    className="relative bg-white/5 overflow-hidden group cursor-pointer border border-white/10 hover:border-yellow-400/50 transition-all duration-300 flex flex-col h-full md:h-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    {/* Image */}
                    <div className="relative h-48 md:h-56 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col h-full">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-3 line-clamp-2" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                        {item.title}
                      </h3>
                      <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4 line-clamp-3 shrink-0">
                        {item.description}
                      </p>
                      
                      {/* Metadata - Single line */}
                      <div className="flex flex-wrap items-center gap-3 mb-4 shrink-0 text-sm">
                        {item.date && (
                          <div className="flex items-center gap-1.5 text-yellow-400">
                            <HiOutlineCalendarDateRange className="w-4 h-4 shrink-0" />
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
                          <div className="inline-block px-3 py-1 bg-yellow-400/20 text-yellow-400 text-xs font-semibold rounded-full whitespace-nowrap">
                            {item.status}
                          </div>
                        )}
                      </div>

                      {/* Link - Always at bottom */}
                      {(activeTab === 'featured' || activeTab === 'upcoming') && (item as Event).id ? (
                        <Link
                          href={`/events-impact/${(item as Event).id}`}
                          className="tagline inline-flex items-center gap-2 text-yellow-400 font-semibold text-base md:text-2xl hover:text-yellow-300 transition-colors group/link mt-auto"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="relative">
                            Register Now
                            <svg 
                              className="absolute -bottom-1 left-0 w-full" 
                              preserveAspectRatio="none" 
                              viewBox="0 0 200 10"
                              style={{ height: '6px' }}
                            >
                              <path 
                                d="M0,8 L10,2 L20,8 L30,2 L40,8 L50,2 L60,8 L70,2 L80,8 L90,2 L100,8 L110,2 L120,8 L130,2 L140,8 L150,2 L160,8 L170,2 L180,8 L190,2 L200,8" 
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                              />
                            </svg>
                          </span>
                          <HiArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover/link:translate-x-1" />
                        </Link>
                      ) : (
                        <Link
                          href="/events-impact"
                          className="tagline inline-flex items-center gap-2 text-yellow-400 font-semibold text-base md:text-2xl hover:text-yellow-300 transition-colors group/link mt-auto"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="relative">
                            {tEvents('learnMore')}
                            <svg 
                              className="absolute -bottom-1 left-0 w-full" 
                              preserveAspectRatio="none" 
                              viewBox="0 0 200 10"
                              style={{ height: '6px' }}
                            >
                              <path 
                                d="M0,8 L10,2 L20,8 L30,2 L40,8 L50,2 L60,8 L70,2 L80,8 L90,2 L100,8 L110,2 L120,8 L130,2 L140,8 L150,2 L160,8 L170,2 L180,8 L190,2 L200,8" 
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                              />
                            </svg>
                          </span>
                          <HiArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover/link:translate-x-1" />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                );
              }
            })}
            </motion.div>
          )} 

          {/* CTA Button */}
          <motion.div className="text-left" variants={itemVariants}>
            <div className="relative inline-block group">
              {/* Shadow Box - Enhanced on hover */}
              <div className="absolute inset-0 bg-white/15 translate-x-1 translate-y-1 md:translate-x-2 md:translate-y-2 group-hover:translate-x-2 group-hover:translate-y-2 md:group-hover:translate-x-3 md:group-hover:translate-y-3 transition-all duration-300"></div>
              <Link href="/events-impact" className="relative px-8 py-4 bg-yellow-400 text-black font-semibold text-base md:text-lg transition-all duration-300 cursor-pointer overflow-hidden flex items-center gap-2 whitespace-nowrap md:mx-0 group-hover:-translate-y-1 md:group-hover:-translate-y-2">
                <span className="relative z-10 flex items-center gap-2">
                  {t('viewAll')}
                  <HiArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left pointer-events-none"></span>
                <span className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 gap-2 pointer-events-none">
                  {t('viewAll')}
                  <HiArrowRight className="w-5 h-5 transition-transform duration-300 translate-x-1" />
                </span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
    
  );
}

