'use client';

import { useState, useEffect, useMemo } from 'react';
import Button from '@/components/Button';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { HiArrowRight, HiLightBulb, HiUsers, HiClock, HiTrendingUp, HiSparkles } from 'react-icons/hi';
import { HiOutlineCalendarDateRange, HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import { MdOutlineFeaturedPlayList } from 'react-icons/md';
import { PiClockCountdownFill, PiGraduationCapBold } from 'react-icons/pi';
import { VscLocation } from 'react-icons/vsc';
import { motion } from 'framer-motion';
import { getPrograms } from '@/lib/supabase/programs';
import { getEvents } from '@/lib/supabase/events';
import { getTrainings } from '@/lib/supabase/trainings';
import { getProjects } from '@/lib/supabase/projects';
import { Database } from '@/lib/supabase/types';
import CircularProgress from '@/components/CircularProgress';
import Loader from '@/components/Loader';

type Program = Database['public']['Tables']['programs']['Row'];
type Event = Database['public']['Tables']['events']['Row'];
type Training = Database['public']['Tables']['trainings']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];

interface ActivityItem {
  id: string;
  title: string;
  meta: string;
  description: string;
  date: string;
  tag: string;
}

const parseCount = (value?: string | null) => {
  if (!value) return 0;
  const digits = value.match(/\d+/);
  return digits ? Number(digits[0]) : 0;
};

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const tEvents = useTranslations('featuredEvents');
  const router = useRouter();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [programsData, eventsData, trainingsData, projectsData] = await Promise.all([
          getPrograms(),
          getEvents(),
          getTrainings(),
          getProjects(),
        ]);
        setPrograms(programsData);
        setEvents(eventsData);
        setTrainings(trainingsData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const activeProjects = useMemo(() => projects.filter((project) => project.status !== 'completed'), [projects]);
  const highlightedActiveProjects = useMemo(() => activeProjects.slice(0, 3), [activeProjects]);
  const upcomingEvents = useMemo(() => events.filter((e) => e.type === 'upcoming').slice(0, 5), [events]);
  const featuredEvents = useMemo(() => events.filter((e) => e.type === 'featured').slice(0, 3), [events]);
  const eventPipeline = useMemo(
    () => [...featuredEvents, ...upcomingEvents].slice(0, 5),
    [featuredEvents, upcomingEvents]
  );
  const highlightedPrograms = useMemo(() => programs.slice(0, 3), [programs]);
  const highlightedTrainings = useMemo(() => trainings.slice(0, 3), [trainings]);

  const totalProgramParticipants = useMemo(
    () => programs.reduce((sum, program) => sum + parseCount(program.participants), 0),
    [programs]
  );
  const totalEventParticipants = useMemo(
    () => events.reduce((sum, event) => sum + (event.participants ?? 0), 0),
    [events]
  );
  
  // Analytics calculations
  const completedProjects = useMemo(() => projects.filter((p) => p.status === 'completed').length, [projects]);
  const averageProjectProgress = useMemo(() => {
    const projectsWithProgress = projects.filter((p) => p.progress !== null && p.progress !== undefined);
    if (projectsWithProgress.length === 0) return 0;
    const sum = projectsWithProgress.reduce((acc, p) => acc + (p.progress || 0), 0);
    return Math.round(sum / projectsWithProgress.length);
  }, [projects]);

  const stats = [
    {
      id: 'programs',
      value: programs.length,
      label: t('stats.programs.label'),
      meta: t('stats.programs.meta'),
      secondary: totalProgramParticipants > 0 ? `${totalProgramParticipants.toLocaleString()} participants` : undefined,
    },
    {
      id: 'events',
      value: events.length,
      label: t('stats.events.label'),
      meta: t('stats.events.meta'),
      secondary: totalEventParticipants > 0 ? `${totalEventParticipants.toLocaleString()} participants` : undefined,
    },
    {
      id: 'trainings',
      value: trainings.length,
      label: t('stats.trainings.label'),
      meta: t('stats.trainings.meta'),
    },
    {
      id: 'projects',
      value: activeProjects.length,
      label: t('stats.projects.label'),
      meta: t('stats.projects.meta'),
      secondary: completedProjects > 0 ? `${completedProjects} completed` : undefined,
    },
  ];

  const activityFeed: ActivityItem[] = useMemo(() => {
    const latestEvents = events
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 2)
      .map<ActivityItem>((event) => ({
        id: `event-${event.id}`,
        title: event.title,
        meta: event.location,
        description: event.description,
        date: new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        tag: tEvents(`tabs.${event.type === 'featured' ? 'featured' : 'upcoming'}`),
      }));

    const latestProjects = projects
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 2)
      .map<ActivityItem>((project) => ({
        id: `project-${project.id}`,
        title: project.title,
        meta: project.status,
        description: project.description,
        date: project.start_date ?? project.end_date ?? '',
        tag: t('sections.projects.title'),
      }));

    return [...latestEvents, ...latestProjects].slice(0, 4);
  }, [events, projects, t, tEvents]);

  const quickActions = [
    {
      id: 'event',
      label: t('actions.planEvent'),
      onClick: () => router.push('/dashboard/events'),
      variant: 'outline-yellow' as const,
      Icon: HiOutlineCalendarDateRange,
    },
    {
      id: 'training',
      label: t('actions.launchTraining'),
      onClick: () => router.push('/dashboard/trainings'),
      variant: 'outline-white' as const,
      Icon: PiGraduationCapBold,
    },
    {
      id: 'project',
      label: t('actions.updateProject'),
      onClick: () => router.push('/dashboard/projects'),
      variant: 'secondary' as const,
      Icon: HiLightBulb,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-8">
          {/* Header Section */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between pb-8 border-b border-white/10"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
              
                <div>
                  <p className="tagline text-yellow-400 text-sm font-semibold uppercase tracking-wider">
                    {t('heading')}
                  </p>
                  <h1 className="text-4xl md:text-5xl font-bold mt-1" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                    {t('description')}
                  </h1>
                </div>
              </div>
              <p className="text-gray-300 text-base md:text-lg max-w-2xl ">
                {t('sections.activity.subtitle')}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Button
                    type="button"
                    variant={action.variant}
                    onClick={action.onClick}
                    className="flex items-center gap-3 whitespace-nowrap hover:scale-105 transition-transform"
                  >
                    <action.Icon className="w-5 h-5" />
                    {action.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.header>

          {loading ? (
            <div className="text-center py-20">
              <Loader size={48} className="mb-4" />
              <p className="text-gray-400">Loading dashboard data...</p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 rounded-lg flex flex-col gap-4 hover:border-yellow-400/30 hover:shadow-lg hover:shadow-yellow-400/10 transition-all duration-300 overflow-hidden"
                  >
                    {/* Background gradient effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <p className="text-sm uppercase tracking-wide text-gray-400 font-medium">{stat.label}</p>
                      {stat.id === 'projects' && averageProjectProgress > 0 && (
                        <CircularProgress progress={averageProjectProgress} size={40} strokeWidth={4} />
                      )}
                    </div>
                    <div className="relative z-10">
                      <p className="text-5xl font-bold text-yellow-400 mb-2">
                        {stat.value}
                      </p>
                      {stat.secondary && (
                        <p className="text-xs text-yellow-400/80 flex items-center gap-1.5 font-medium">
                          <HiTrendingUp className="w-3.5 h-3.5" />
                          {stat.secondary}
                        </p>
                      )}
                    </div>
                    <p className="relative z-10 text-sm text-gray-400 mt-auto">{stat.meta}</p>
                  </motion.div>
                ))}
              </div>

    {/* Main Content Grid */}
<div className="grid gap-8 lg:grid-cols-3">
  {/* Events Section */}
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="lg:col-span-2 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-8 hover:border-gray-300 transition-all"
  >
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-yellow-100 rounded-lg border border-yellow-200">
          <HiOutlineCalendarDateRange className="w-6 h-6 text-yellow-400" />
        </div>
        <div>
          <p className="text-yellow-700 text-sm font-semibold uppercase tracking-wider">
            {t('sections.events.subtitle')}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mt-1 text-gray-900" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
            {t('sections.events.title')}
          </h2>
        </div>
      </div>
      <Link
        href="/dashboard/events"
        className="inline-flex items-center gap-2 text-yellow-700 hover:text-yellow-600 transition-colors px-4 py-2 rounded-lg hover:bg-yellow-100"
      >
        View All Events
        <HiArrowRight className="w-4 h-4" />
      </Link>
    </div>

    <div className="space-y-4">
      {eventPipeline.length ? (
        eventPipeline.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            className="border border-gray-200 bg-white p-5 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-all group flex flex-col"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 text-xs uppercase tracking-wide bg-yellow-100 text-yellow-700 rounded">
                  {event.type === 'featured'
                    ? tEvents('tabs.featured')
                    : tEvents('tabs.upcoming')}
                </span>
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <HiOutlineCalendarDateRange className="w-4 h-4 text-yellow-400" />
                  {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{event.title}</h3>
              <p className="text-gray-700 text-sm mb-4 line-clamp-2">{event.description}</p>
              <div className="flex items-center gap-4 text-gray-700 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <VscLocation className="w-4 h-4 text-gray-700" />
                  {event.location}
                </div>
                {event.participants !== undefined && event.participants > 0 && (
                  <div className="flex items-center gap-2">
                    <HiUsers className="w-4 h-4 text-gray-700" />
                    {event.participants} participants
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-auto pt-4 border-t border-gray-200">
              <Link
                href="/dashboard/events"
                className="inline-flex items-center gap-2 text-yellow-700 hover:text-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-100 group-hover:translate-x-1 transition-all"
              >
                View Details
                <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        ))
      ) : (
        <p className="text-gray-500 text-center py-8">{t('empty')}</p>
      )}
    </div>
  </motion.div>
</div>


            {/* Activity Feed */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-lg p-8 hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                <div className="p-3 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                  <HiSparkles className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-yellow-400 text-sm font-semibold uppercase tracking-wider">
                    {t('sections.activity.subtitle')}
                  </p>
                  <h2 className="text-2xl font-bold mt-1" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                    {t('sections.activity.title')}
                  </h2>
                </div>
              </div>
              <div className="space-y-4">
                {activityFeed.length ? (
                  activityFeed.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                      className="border border-white/10 p-4 bg-black/30 rounded-lg hover:border-yellow-400/30 hover:bg-black/50 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs uppercase tracking-wide text-yellow-400 font-medium px-2 py-1 bg-yellow-400/10 rounded">
                          {item.tag}
                        </span>
                        <span className="text-xs text-gray-400">{item.date}</span>
                      </div>
                      <h3 className="text-lg font-semibold mt-2 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">{item.meta}</p>
                      <p className="text-sm text-gray-300 line-clamp-2">{item.description}</p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8">{t('empty')}</p>
                )}
              </div>
            </motion.div>
          

          {/* Bottom Section - Programs, Trainings, Projects */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Programs Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              
                <div>
                  <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                    {t('sections.programs.title')}
                  </h2>
                  <p className="text-yellow-400 text-xs uppercase tracking-wider mt-0.5">
                    {t('sections.programs.subtitle')}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {highlightedPrograms.map((program, index) => (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="group border-l-2 border-yellow-400/30 pl-4 py-3 hover:border-yellow-400 transition-colors"
                  >
                    <h3 className="text-base font-semibold mb-1.5 group-hover:text-yellow-400 transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-1 mb-2.5">{program.description}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {program.category && (
                        <span className="px-2 py-0.5 bg-white/10 border border-white/20 uppercase tracking-wide rounded text-gray-300">
                          {program.category}
                        </span>
                      )}
                      {program.duration && (
                        <span className="flex items-center gap-1.5 text-gray-400">
                          <PiClockCountdownFill className="w-3.5 h-3.5 text-yellow-400" />
                          {program.duration}
                        </span>
                      )}
                      {program.participants && (
                        <span className="flex items-center gap-1.5 text-gray-400">
                          <HiUsers className="w-3.5 h-3.5 text-yellow-400" />
                          {program.participants}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              <Link href="/dashboard/programs" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors text-sm mt-6 pt-4 border-t border-white/10">
                {t('links.viewPrograms')}
                <HiArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Trainings Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
               
                <div>
                  <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                    {t('sections.trainings.title')}
                  </h2>
                  <p className="text-yellow-400 text-xs uppercase tracking-wider mt-0.5">
                    {t('sections.trainings.subtitle')}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {highlightedTrainings.map((training, index) => (
                  <motion.div
                    key={training.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    className="group border-l-2 border-yellow-400/30 pl-4 py-3 hover:border-yellow-400 transition-colors"
                  >
                    <h3 className="text-base font-semibold mb-1.5 group-hover:text-yellow-400 transition-colors">
                      {training.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-1 mb-2.5">{training.description}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className={`px-2 py-0.5 rounded border ${
                        training.level === 'beginner' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        training.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {training.level}
                      </span>
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <PiClockCountdownFill className="w-3.5 h-3.5 text-yellow-400" />
                        {training.duration}
                      </span>
                      {training.format && (
                        <span className="text-gray-400 capitalize">
                          {training.format}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              <Link href="/dashboard/trainings" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors text-sm mt-6 pt-4 border-t border-white/10">
                View All Trainings
                <HiArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Projects Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
             
                <div>
                  <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                    {t('sections.projects.title')}
                  </h2>
                  <p className="text-yellow-400 text-xs uppercase tracking-wider mt-0.5">
                    {t('sections.projects.subtitle')}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {highlightedActiveProjects.length ? (
                  highlightedActiveProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                      className="group border-l-2 border-yellow-400/30 pl-4 py-3 hover:border-yellow-400 transition-colors relative"
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <h3 className="text-base font-semibold group-hover:text-yellow-400 transition-colors pr-2">
                          {project.title}
                        </h3>
                        {project.progress !== undefined && project.progress !== null && (
                          <div className="shrink-0">
                            <CircularProgress progress={project.progress} size={32} strokeWidth={4} />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-1 mb-2">{project.description}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs uppercase tracking-wide px-2 py-0.5 rounded border ${
                          project.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          project.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                          'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {project.status}
                        </span>
                        {project.progress !== undefined && project.progress !== null && (
                          <span className="text-xs text-gray-400">
                            {project.progress}%
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8 text-sm">{t('empty')}</p>
                )}
              </div>
              <Link href="/dashboard/projects" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors text-sm mt-6 pt-4 border-t border-white/10">
                View All Projects
                <HiArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
            </>
          )}
        </div>
    </div>
  );
}
