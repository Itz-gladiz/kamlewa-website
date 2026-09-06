'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { supabase } from '@/lib/supabase/supabaseClient';
import { HiLockClosed, HiMail, HiEye, HiEyeOff } from 'react-icons/hi';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Loader from '@/components/Loader';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          window.location.assign('/dashboard');
          return;
        }
      } catch {
        // Session check failed — stay on login page
      } finally {
        setCheckingAuth(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        window.location.assign('/dashboard');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Signing in...');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        toast.success('Welcome back!', { id: loadingToast });
        // Hard navigation so the proxy sees the new auth cookies
        window.location.assign('/dashboard');
        return;
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Invalid email or password';
      toast.error(message, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader size={128} className="mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative w-16 h-20">
              <Image src="/images/logo.png" alt="Kamlewa Logo" fill sizes="64px" className="object-contain" />
            </div>
            <div className="flex flex-col items-start">
              <h1 className="text-3xl font-bold text-white uppercase" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                KAMLEWA
              </h1>
              <p className="tagline text-yellow-400 text-base font-semibold">Admin Dashboard</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
            Welcome Back
          </h2>
          <p className="text-gray-400 text-lg">Sign in to access the admin dashboard</p>
        </div>

        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-lg p-8 md:p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-base font-medium text-white/70 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiMail className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@kamlewa.org"
                  className="w-full pl-12 text-base bg-white/10 border-white/30 placeholder-gray-500 focus:border-yellow-400"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-base font-medium text-white/70 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiLockClosed className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 text-base bg-white/10 border-white/30 placeholder-gray-500 focus:border-yellow-400"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-yellow-400 transition-colors"
                  disabled={loading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center text-base py-4"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader size={20} />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-sm text-gray-500 text-center">
              Secure admin access only. Unauthorized access is prohibited.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href="/"
            className="text-base text-gray-400 hover:text-yellow-400 transition-colors inline-flex items-center gap-2"
          >
            <span>←</span>
            Back to Public Site
          </a>
        </div>
      </motion.div>
    </div>
  );
}
