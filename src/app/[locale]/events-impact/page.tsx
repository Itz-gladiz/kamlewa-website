'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageBanner from '@/components/PageBanner';
import Pagination from '@/components/Pagination';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { HiClock, HiUsers, HiArrowRight, HiSearch, HiX } from 'react-icons/hi';
import { Link } from '@/i18n/routing';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { MdOutlineFeaturedPlayList, MdOutlineEventNote, MdOutlineSwipe } from 'react-icons/md';
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import { FaFirstdraft } from 'react-icons/fa6';
import { HiOutlineCalendarDateRange } from 'react-icons/hi2';
import { PiGraduationCapBold } from 'react-icons/pi';
import { VscLocation } from 'react-icons/vsc';
import { PiClockCountdownFill } from 'react-icons/pi';
import { Program } from '@/data/programs';
import { Event } from '@/data/events';
import { Project } from '@/data/projects';
import { Training } from '@/data/trainings';
import { getEvents } from '@/lib/supabase/events';
import { getProjects } from '@/lib/supabase/projects';
import { getTrainings } from '@/lib/supabase/trainings';
import { getPrograms } from '@/lib/supabase/programs';
import { mapDbEventToEvent } from '@/utils/eventMapper';
import { mapDbProjectToProject } from '@/utils/projectMapper';
import { mapDbTrainingToTraining } from '@/utils/trainingMapper';
import { mapDbProgramToProgram } from '@/utils/programMapper';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';

type TabType = 'programs' | 'featured' | 'upcoming' | 'projects' | 'trainings' | 'reports';

const ITEMS_PER_PAGE = 6;

export default function EventsImpactPage() {
  const t = useTranslations('eventsImpact');
  const tPrograms = useTranslations('programs');
  const tEvents = useTranslations('featuredEvents');
  const tEventModal = useTranslations('events');
  
  const [activeTab, setActiveTab] = useState<TabType>('programs');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when tab or search changes
  }, [activeTab, searchQuery]);

  // Load all data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load programs
        try {
          const dbPrograms = await getPrograms();
          const mappedPrograms = dbPrograms.map(mapDbProgramToProgram);
          setPrograms(mappedPrograms);
        } catch (error) {
          console.error('Error loading programs:', error);
          setPrograms([]);
        }
        
        // Load events
        try {
          const dbEvents = await getEvents();
          const mappedEvents = dbEvents.map(mapDbEventToEvent);
          setEvents(mappedEvents);
        } catch (error) {
          console.error('Error loading events:', error);
          setEvents([]);
        }
        
        // Load projects
        try {
          const dbProjects = await getProjects();
          const mappedProjects = dbProjects.map(mapDbProjectToProject);
          setProjects(mappedProjects);
        } catch (error) {
          console.error('Error loading projects:', error);
          setProjects([]);
        }
        
        // Load trainings
        try {
          const dbTrainings = await getTrainings();
          const mappedTrainings = dbTrainings.map(mapDbTrainingToTraining);
          setTrainings(mappedTrainings);
        } catch (error) {
          console.error('Error loading trainings:', error);
          setTrainings([]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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
        scrollToSection('content');
      } else if (distance < 0 && currentIndex > 0) {
        // Swipe right - go to previous tab
        setActiveTab(tabs[currentIndex - 1].id);
        scrollToSection('content');
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const dismissSwipeHint = () => {
    setShowSwipeHint(false);
    localStorage.setItem('hasSeenSwipeHint', 'true');
  };

  const tabs = [
    { id: 'programs' as const, label: tPrograms('tabs.programs'), icon: FaFirstdraft },
    { id: 'featured' as const, label: tEvents('tabs.featured'), icon: MdOutlineFeaturedPlayList },
    { id: 'upcoming' as const, label: tEvents('tabs.upcoming'), icon: HiOutlineCalendarDateRange },
    { id: 'projects' as const, label: tEvents('tabs.projects'), icon: HiOutlineClipboardDocumentList },
    { id: 'trainings' as const, label: tEvents('tabs.trainings'), icon: PiGraduationCapBold },
    { id: 'reports' as const, label: t('reports'), icon: HiOutlineClipboardDocumentList },
  ];

  // Filter and paginate data based on active tab and search
  const { filteredData, totalPages } = useMemo(() => {
    let data: (Program | Event | Project | Training)[] = [];

    switch (activeTab) {
      case 'programs':
        data = programs;
        break;
      case 'featured':
        data = events.filter(e => e.type === 'featured');
        break;
      case 'upcoming':
        data = events.filter(e => e.type === 'upcoming');
        break;
      case 'projects':
        data = projects;
        break;
      case 'trainings':
        data = trainings;
        break;
      case 'reports':
        data = [];
        break;
    }

    // Filter by search query
    const filtered = searchQuery
      ? data.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : data;

    // Calculate pagination
    const total = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return { filteredData: paginated, totalPages: total };
  }, [activeTab, searchQuery, currentPage, programs, events, projects, trainings]);

  const scrollToSection = (sectionId: string) => {
    const element = sectionsRef.current[sectionId];
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const renderCard = (item: Program | Event | Project | Training, index: number) => {
    const isProgram = 'fullDescription' in item;
    const isEvent = 'type' in item;
    const isProject = 'status' in item && 'progress' in item;
    const isTraining = 'level' in item && 'duration' in item;

    // Determine the detail page URL
    const getDetailUrl = () => {
      if (isEvent) return `/events-impact/${item.id}`;
      if (isProgram) return `/events-impact/programs/${item.id}`;
      if (isProject) return `/events-impact/projects/${item.id}`;
      if (isTraining) return `/events-impact/trainings/${item.id}`;
      return '/contact';
    };

    const detailUrl = getDetailUrl();

    return (
      <Link href={detailUrl}>
        <motion.div
          key={item.id}
          className="relative bg-white/5 border border-white/10 overflow-hidden group cursor-pointer hover:border-yellow-400/50 transition-all duration-300"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300"></div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
            {item.title}
          </h3>
          <p className="text-gray-300 text-sm md:text-base mb-4 line-clamp-2">
            {item.description}
          </p>


          {/* Event-specific metadata */}
          {isEvent && (
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-yellow-400 text-sm">
                <HiOutlineCalendarDateRange className="w-4 h-4" />
                <span>{item.date}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <VscLocation className="w-4 h-4" />
                <span>{item.location}</span>
              </div>
              {item.participants && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <HiUsers className="w-4 h-4" />
                  <span>{item.participants} participants</span>
                </div>
              )}
            </div>
          )}

          {/* Project-specific metadata */}
          {isProject && (
            <div className="space-y-2 mb-4">
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                item.status === 'active' ? 'bg-green-500/20 text-green-400' :
                item.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {item.status}
              </div>
              {item.progress !== undefined && (
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Training-specific metadata */}
          {isTraining && (
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-yellow-400 text-sm">
                <PiClockCountdownFill className="w-4 h-4" />
                <span>{item.duration}</span>
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                item.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                item.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {item.level}
              </div>
              {item.format && (
                <div className="text-gray-400 text-sm">
                  Format: {item.format}
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="flex flex-col gap-2 pointer-events-none">
            {isEvent ? (
              <div className="tagline inline-flex items-center justify-center gap-2 text-yellow-400 font-semibold text-sm md:text-base bg-yellow-400/10 px-4 py-2 rounded border border-yellow-400/20">
                {tEventModal('registerButton')}
                <HiArrowRight className="w-4 h-4" />
              </div>
            ) : (
              <div className="tagline inline-flex items-center gap-2 text-yellow-400 font-semibold text-sm md:text-base">
                View Details
                <HiArrowRight className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
      </Link>
    );
  };

  return (
    <main className="relative">
      <Navbar />
      
      {/* Page Banner */}
      <PageBanner
        subheading={t('subheading')}
        heading={t('heading')}
        description={t('description')}
      />
      {/* Mobile Tabs */}
      <div className="sticky top-20 md:hidden z-50 bg-black border-b border-gray-800 shadow-lg">
        <div className="relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black via-black/80 to-transparent pointer-events-none z-10"></div>
          <div className="flex gap-1 overflow-x-auto scrollbar-hide scroll-smooth pb-1 -mr-3">
            {tabs.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isLast = index === tabs.length - 1;
              
              return (
                <div key={item.id} className={`relative shrink-0 ${isLast ? 'pr-3' : ''}`}>
                  {isActive && (
                    <div className="absolute inset-0 bg-white/15 translate-x-1 translate-y-1"></div>
                  )}
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      scrollToSection('content');
                    }}
                    className={`relative flex items-center gap-2 px-3 md:px-6 py-4 cursor-pointer font-medium text-sm md:text-base transition-all duration-200 ${
                      isActive
                        ? 'bg-yellow-400 text-black'
                        : 'text-white/70 hover:text-white bg-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-2 relative z-10">
                      <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                      {/* Show text on desktop always, on mobile only when active */}
                      <span className={`whitespace-nowrap transition-all duration-200 ${
                        isActive ? 'opacity-100 max-w-[200px] md:max-w-none' : 'opacity-0 max-w-0 md:opacity-100 md:max-w-none'
                      } overflow-hidden`}>
                        {item.label}
                      </span>
                    </span>
                    <span 
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 transition-all duration-300 ease-in-out ${
                        isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                      }`}
                      style={{ transformOrigin: 'left center' }}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Swipe Hint Tooltip - Mobile only, above content */}
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

      {/* Desktop Sidebar & Content */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 sticky top-24 h-fit">
          <div className="px-6 py-8 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 bg-white/5 border-white/10 placeholder-gray-400 focus:ring-1 focus:ring-yellow-400"
              />
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {tabs.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      scrollToSection('content');
                    }}
                    className={`relative w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                      isActive
                        ? 'text-yellow-400 font-semibold'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"></div>
                    )}
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <section 
            id="content" 
            ref={(el) => { sectionsRef.current['content'] = el; }}
            className="bg-black text-white py-16 md:py-24 relative z-10"
          >
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
                    {tabs.find(t => t.id === activeTab)?.label}
                    <span className="absolute bottom-0 left-1/2 md:left-0 transform -translate-x-full md:translate-x-0 w-1/2 h-0.5 bg-yellow-400"></span>
                  </motion.p>
                  <motion.h2
                    className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
                    variants={itemVariants}
                    style={{ fontFamily: 'var(--font-nourd), sans-serif' }}
                  >
                    {tabs.find(t => t.id === activeTab)?.label}
                  </motion.h2>
                  {searchQuery && (
                    <motion.p
                      className="text-gray-300 text-base md:text-lg"
                      variants={itemVariants}
                    >
                      Found {filteredData.length} result{filteredData.length !== 1 ? 's' : ''} for "{searchQuery}"
                    </motion.p>
                  )}
                </motion.div>

                {/* Content Grid */}
                {loading ? (
                  <div className="flex justify-center items-center py-12 min-h-[400px]">
                    <Loader />
                  </div>
                ) : activeTab === 'reports' ? (
                  <motion.div
                    className="text-center py-12"
                    variants={itemVariants}
                  >
                    <p className="text-gray-300 text-lg mb-4">
                      {t('reports')} - Coming Soon
                    </p>
                    <p className="text-gray-400">
                      We are preparing comprehensive impact reports for you. Stay tuned!
                    </p>
                  </motion.div>
                ) : filteredData.length > 0 ? (
                  <>
                    <div 
                      ref={contentContainerRef}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
                    >
                      {filteredData.map((item, index) => renderCard(item, index))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    )}
                  </>
                ) : (
                  <motion.div
                    className="text-center py-12"
                    variants={itemVariants}
                  >
                    <p className="text-gray-400 text-lg">
                      {searchQuery ? 'No results found. Try a different search term.' : 'No items available.'}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
