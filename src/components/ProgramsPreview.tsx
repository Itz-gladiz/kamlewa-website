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
import { getPrograms } from '@/lib/supabase/programs';
import { getProjects } from '@/lib/supabase/projects';
import { getReports } from '@/lib/supabase/reports';
import { getTrainings } from '@/lib/supabase/trainings';
import { mapDbEventToEvent } from '@/utils/eventMapper';
import { mergeStaticReports, Report } from '@/data/staticReports';
import { Event } from '@/data/events';
import { Database } from '@/lib/supabase/types';
import Loader from './Loader';
import toast from 'react-hot-toast';
import { PreviewCard, ProgramCard } from './PreviewCard';
import CircularProgress from './CircularProgress';

type ProgramRow = Database['public']['Tables']['programs']['Row'];
type ProjectRow = Database['public']['Tables']['projects']['Row'];
type TrainingRow = Database['public']['Tables']['trainings']['Row'];
type PreviewItem = Event | {
  id?: string;
  title: string;
  description: string;
  image: string;
  status?: string;
  startDate?: string;
  progress?: number;
  duration?: string;
  level?: string;
};

export default function ProgramsPreview() {
  const t = useTranslations('programs');
  const tEvents = useTranslations('featuredEvents');
  const router = useRouter();
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'programs' | 'featured' | 'upcoming' | 'projects' | 'trainings' | 'reports'>('programs');
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [programs, setPrograms] = useState<ProgramRow[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [trainings, setTrainings] = useState<TrainingRow[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
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

  const tabs = [
    { id: 'programs' as const, label: t('tabs.programs'), icon: FaFirstdraft },
    { id: 'featured' as const, label: tEvents('tabs.featured'), icon: MdOutlineFeaturedPlayList },
    { id: 'upcoming' as const, label: tEvents('tabs.upcoming'), icon: HiOutlineCalendarDateRange },
    { id: 'projects' as const, label: tEvents('tabs.projects'), icon: HiOutlineClipboardDocumentList },
    { id: 'trainings' as const, label: tEvents('tabs.trainings'), icon: PiGraduationCapBold },
    { id: 'reports' as const, label: t('reports') || 'Reports', icon: HiOutlineClipboardDocumentList },
  ];

  // Load events, programs, projects, and trainings from Supabase
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
        setFeaturedEvents([]);
        setUpcomingEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };

    const loadData = async () => {
      try {
        setLoadingData(true);
        const [programsData, projectsData, reportsData, trainingsData] = await Promise.all([
          getPrograms(),
          getProjects(),
          getReports(),
          getTrainings(),
        ]);

        setPrograms(programsData);
        setProjects(projectsData);
        setReports(mergeStaticReports(reportsData));
        setTrainings(trainingsData);
      } catch (error) {
        console.error('Error loading preview data:', error);
        setPrograms([]);
        setProjects([]);
        setReports(mergeStaticReports([]));
        setTrainings([]);
      } finally {
        setLoadingData(false);
      }
    };

    loadEvents();
    loadData();
  }, []);

  const currentProjectsFallback: any[] = [];

  const trainingsFallback = [
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

  const programsFallback = [
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

  const currentProjectRows = projects.filter((project) => project.status !== 'completed');

  const currentProjects = projects.length > 0
    ? currentProjectRows.slice(0, 3).map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        status: project.status,
        image: project.image,
        startDate: project.start_date ? new Date(project.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : undefined,
        progress: project.progress ?? undefined,
      }))
    : currentProjectsFallback;

  const programCards = programs.length > 0
    ? programs.slice(0, 4).map((program) => ({
        id: program.id,
        title: program.title,
        description: program.description,
        image: program.image,
      }))
    : programsFallback;

  const trainingCards = trainings.length > 0
    ? trainings.slice(0, 3).map((training) => ({
        id: training.id,
        title: training.title,
        description: training.description,
        duration: training.duration,
        level: training.level,
        image: training.image,
      }))
    : trainingsFallback;

  const reportCards = reports.length > 0
    ? reports.map((report) => ({
        id: report.id,
        title: report.title,
        description: report.description,
        image: report.image || '/images/2023%202025%20IMPACT%20REPORT/cover%20page.png',
      }))
    : [];

  const getCurrentData = (): PreviewItem[] => {
    switch (activeTab) {
      case 'programs':
        return programCards;
      case 'featured':
        return featuredEvents;
      case 'upcoming':
        return upcomingEvents;
      case 'projects':
        return currentProjects;
      case 'trainings':
        return trainingCards;
      case 'reports':
        return reportCards;
      default:
        return programCards;
    }
  };

  const isContentLoading =
    activeTab === 'featured' || activeTab === 'upcoming'
      ? loadingEvents
      : loadingData;

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
              {getCurrentData().map((item, index) => {
              const isActive = activeCard === index;
              const isProgramTab = activeTab === 'programs';
              
              if (isProgramTab) {
                return (
                  <ProgramCard
                    key={`program-${index}`}
                    item={item}
                    index={index}
                    isActive={isActive}
                    onToggle={() => setActiveCard(isActive ? null : index)}
                  />
                );
              } else {
                return (
                  <PreviewCard
                    key={`${activeTab}-${index}`}
                    item={item}
                    index={index}
                    activeTab={activeTab}
                    tEvents={tEvents}
                  />
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
