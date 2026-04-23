'use client';

import { useState, useRef, useEffect } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { HiArrowRight, HiMenu, HiX, HiUsers, HiSearch, HiBell, HiCog, HiLogout } from 'react-icons/hi';
import { HiOutlineCalendarDateRange, HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import { MdOutlineFeaturedPlayList } from 'react-icons/md';
import { PiGraduationCapBold } from 'react-icons/pi';
import { HiLightBulb, HiMail } from 'react-icons/hi';
import { VscChevronRight } from 'react-icons/vsc';
import { TbLayoutDashboard } from 'react-icons/tb';
import { supabase } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('dashboard');
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const searchRef = useRef<HTMLInputElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { href: '/dashboard', label: t('nav.dashboard'), icon: TbLayoutDashboard },
    { href: '/dashboard/programs', label: t('nav.programs'), icon: MdOutlineFeaturedPlayList },
    { href: '/dashboard/events', label: t('nav.events'), icon: HiOutlineCalendarDateRange },
    { href: '/dashboard/trainings', label: t('nav.trainings'), icon: PiGraduationCapBold },
    { href: '/dashboard/projects', label: t('nav.projects'), icon: HiLightBulb },
    { href: '/dashboard/contact', label: t('nav.contact'), icon: HiMail },
    { href: '/dashboard/settings', label: t('nav.settings'), icon: HiCog },
  ];

  // Check authentication (skip for login page)
  useEffect(() => {
    // Skip auth check if we're on the login page
    if (pathname === '/dashboard/login' || pathname?.includes('/dashboard/login')) {
      setCheckingAuth(false);
      return;
    }

    // TEMPORARY: Bypass auth for development - REMOVE IN PRODUCTION
    setIsAuthenticated(true);
    setCheckingAuth(false);
    return;

    // Original auth check (commented out for now)
    /*
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsAuthenticated(true);
        } else {
          router.push('/dashboard/login');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/dashboard/login');
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Don't redirect if we're on login page
      if (pathname === '/dashboard/login' || pathname?.includes('/dashboard/login')) {
        return;
      }
      
      if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push('/dashboard/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    */
  }, [router, pathname]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logged out successfully');
      router.push('/dashboard/login');
      setProfileOpen(false);
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to logout');
    }
  };

  // Get breadcrumbs from pathname
  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Dashboard', href: '/dashboard' }];
    
    if (paths.length > 1) {
      const currentPage = paths[paths.length - 1];
      const navItem = navItems.find(item => item.href.includes(currentPage));
      if (navItem) {
        breadcrumbs.push({ label: navItem.label, href: navItem.href });
      }
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target as Node)) {
        setQuickActionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when search opens
  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const quickActions = [
    { label: t('navbar.addProgram'), href: '/dashboard/programs', icon: MdOutlineFeaturedPlayList },
    { label: t('navbar.addEvent'), href: '/dashboard/events', icon: HiOutlineCalendarDateRange },
    { label: t('navbar.addTraining'), href: '/dashboard/trainings', icon: PiGraduationCapBold },
    { label: t('navbar.addProject'), href: '/dashboard/projects', icon: HiLightBulb },
  ];

  // Skip layout for login page
  if (pathname === '/dashboard/login' || pathname?.includes('/dashboard/login')) {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="flex h-screen bg-black text-white items-center justify-center">
        <div className="text-center">
          <Loader size={128} className="mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-black border-r border-white/10 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-8 h-12">
                <Image
                  src="/images/logo.png"
                  alt="Kamlewa Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <h2 className="text-sm font-bold text-white uppercase" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                  KAMLEWA
                </h2>
                <p className="tagline text-yellow-400 text-xs font-semibold">
                  Dashboard
                </p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-yellow-400 transition-colors"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                    isActive
                      ? 'bg-yellow-400/20 text-yellow-400 border-l-2 border-yellow-400'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Link */}
          <div className="p-4 border-t border-white/10">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-white/70 hover:text-yellow-400 transition-colors"
            >
              <HiArrowRight className="w-4 h-4 rotate-180" />
              Back to Site
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-black border-b border-white/10 sticky top-0 z-30">
          <div className="px-4 md:px-6 py-4">
            {/* Mobile Menu Button */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-white hover:text-yellow-400 transition-colors"
              >
                <HiMenu className="w-6 h-6" />
              </button>

              {/* Breadcrumbs */}
              <nav className="hidden md:flex items-center gap-2 flex-1">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.href} className="flex items-center gap-2">
                    {index > 0 && <VscChevronRight className="w-4 h-4 text-white/40" />}
                    <Link
                      href={crumb.href}
                      className={`text-sm transition-colors ${
                        index === breadcrumbs.length - 1
                          ? 'text-yellow-400 font-semibold'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      {crumb.label}
                    </Link>
                  </div>
                ))}
              </nav>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2 md:gap-4">
                {/* Search */}
                <div className="relative">
                  {searchOpen ? (
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded">
                      <HiSearch className="w-5 h-5 text-white/70" />
                      <input
                        ref={searchRef}
                        type="text"
                        placeholder={t('navbar.search')}
                        className="bg-transparent border-none outline-none text-white placeholder-white/50 text-sm w-48 md:w-64"
                        onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                      />
                      <button
                        onClick={() => setSearchOpen(false)}
                        className="text-white/70 hover:text-white"
                      >
                        <HiX className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSearchOpen(true)}
                      className="p-2 text-white/70 hover:text-yellow-400 transition-colors"
                      aria-label="Search"
                    >
                      <HiSearch className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Quick Actions Dropdown */}
                <div className="relative" ref={quickActionsRef}>
                  <button
                    onClick={() => setQuickActionsOpen(!quickActionsOpen)}
                    className="hidden md:flex items-center gap-2 px-3 py-2 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 hover:bg-yellow-400/20 transition-colors rounded text-sm font-medium"
                  >
                    <span>{t('navbar.quickActions')}</span>
                    <VscChevronRight className={`w-4 h-4 transition-transform ${quickActionsOpen ? 'rotate-90' : ''}`} />
                  </button>
                  {quickActionsOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-black border border-white/10 rounded shadow-lg z-50">
                      <div className="p-2">
                        {quickActions.map((action) => {
                          const Icon = action.icon;
                          return (
                            <Link
                              key={action.href}
                              href={action.href}
                              onClick={() => setQuickActionsOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded transition-colors"
                            >
                              <Icon className="w-4 h-4" />
                              {action.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Notifications */}
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2 text-white/70 hover:text-yellow-400 transition-colors"
                    aria-label="Notifications"
                  >
                    <HiBell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
                  </button>
                  {notificationsOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-black border border-white/10 rounded shadow-lg z-50">
                      <div className="p-4 border-b border-white/10">
                        <h3 className="text-sm font-semibold text-white">{t('navbar.notifications')}</h3>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-white/50">{t('navbar.noNotifications')}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-white/5 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center">
                      <HiUsers className="w-4 h-4 text-yellow-400" />
                    </div>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-black border border-white/10 rounded shadow-lg z-50">
                      <div className="p-2">
                        <Link
                          href="/dashboard/settings"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded transition-colors"
                          onClick={() => {
                            setProfileOpen(false);
                          }}
                        >
                          <HiCog className="w-4 h-4" />
                          {t('nav.settings')}
                        </Link>
                        <Link
                          href="/"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <HiArrowRight className="w-4 h-4" />
                          {t('navbar.viewPublicSite')}
                        </Link>
                        <div className="border-t border-white/10 my-1"></div>
                        <button
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded transition-colors"
                          onClick={handleLogout}
                        >
                          <HiLogout className="w-4 h-4" />
                          {t('navbar.logout')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <section className="flex-1 overflow-y-auto p-6 md:p-12">
          {children}
        </section>
      </main>
    </div>
  );
}

