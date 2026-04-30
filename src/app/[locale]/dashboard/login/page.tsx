'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { supabase } from '@/lib/supabase/supabaseClient';
import { HiLockClosed, HiMail, HiEye, HiEyeOff } from 'react-icons/hi';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Loader from '@/components/Loader';

export default function LoginPage() {
  const t = useTranslations('dashboard');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is already logged in and create default user if needed
    const checkSessionAndCreateDefaultUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push('/dashboard');
          setCheckingAuth(false);
          return;
        }

        // Create default user if it doesn't exist
        await createDefaultUserIfNeeded();
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkSessionAndCreateDefaultUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push('/dashboard');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const createDefaultUserIfNeeded = async () => {
    try {
      const email = 'admin@kamlewa.org';
      const password = 'Admin123!@#Kamlewa';

      // Try to sign in first to check if user exists
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If sign in succeeds, user exists - sign out immediately
      if (!signInError) {
        await supabase.auth.signOut();
        console.log('✅ Default admin user already exists');
        toast.success('Default admin user is ready!', { duration: 3000 });
        return;
      }

      // If error is not "Invalid login credentials", something else went wrong
      if (signInError && !signInError.message.includes('Invalid login') && !signInError.message.includes('Invalid') && !signInError.message.includes('Email not confirmed')) {
        console.error('Error checking user:', signInError);
        return;
      }

      // User doesn't exist, create it via API route (which auto-confirms)
      console.log('Creating default admin user...');
      const loadingToast = toast.loading('Creating default admin user...');
      
      const response = await fetch('/api/create-admin-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error?.includes('already exists') || result.error?.includes('already registered')) {
          toast.success('Default admin user already exists!', { id: loadingToast });
          console.log('Default admin user already exists');
        } else {
          toast.error(`Error: ${result.error || 'Failed to create user'}`, { id: loadingToast });
          console.error('Error creating default user:', result.error);
        }
        return;
      }

      if (result.success) {
        toast.success(
          `✅ Default admin user created and confirmed!\n\nEmail: ${email}\nPassword: ${password}\n\nYou can now log in!`,
          { id: loadingToast, duration: 8000 }
        );
        console.log('✅ Default admin user created successfully!');
        console.log('Email: admin@kamlewa.org');
        console.log('Password: Admin123!@#Kamlewa');
      }
    } catch (error: any) {
      console.error('Error in createDefaultUserIfNeeded:', error);
      toast.error(`Error: ${error.message || 'Failed to create user'}`);
    }
  };

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
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid email or password', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader size={128} className="mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative w-12 h-16">
              <Image src="/images/logo.png" alt="Kamlewa Logo" fill sizes="100vw" className="object-contain" />
            </div>
            <div className="flex flex-col items-start">
              <h1 className="text-2xl font-bold text-white uppercase" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                KAMLEWA
              </h1>
              <p className="tagline text-yellow-400 text-sm font-semibold">Admin Dashboard</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
            Welcome Back
          </h2>
          <p className="text-gray-400">Sign in to access the admin dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-lg p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
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
                  placeholder="admin@kamlewa.org"
                  className="w-full pl-12 bg-white/10 border-white/30 placeholder-gray-500 focus:border-yellow-400"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-2">
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
                  className="w-full pl-12 pr-12 bg-white/10 border-white/30 placeholder-gray-500 focus:border-yellow-400"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-yellow-400 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <HiEyeOff className="w-5 h-5" />
                  ) : (
                    <HiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center"
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

          {/* Footer Note */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-gray-500 text-center">
              Secure admin access only. Unauthorized access is prohibited.
            </p>
          </div>
        </div>

        {/* Create User Button & Info */}
        <div className="text-center mt-6 space-y-4">
          <div className="bg-yellow-400/10 border border-yellow-400/30 p-4 rounded-lg">
            <p className="text-sm text-yellow-400 font-semibold mb-2">Default Admin Credentials:</p>
            <div className="text-xs text-gray-300 space-y-1">
              <p><strong>Email:</strong> admin@kamlewa.org</p>
              <p><strong>Password:</strong> Admin123!@#Kamlewa</p>
            </div>
            <p className="text-xs text-yellow-400/80 mt-3">
              ⚠️ User is created automatically. If login fails, check Supabase Dashboard.
            </p>
          </div>
          
          <Button
            onClick={createDefaultUserIfNeeded}
            variant="outline-yellow"
            className="text-sm"
          >
            Manually Create Default User
          </Button>

          <div className="pt-4 border-t border-white/10">
            <a
              href="/"
              className="text-sm text-gray-400 hover:text-yellow-400 transition-colors inline-flex items-center gap-2"
            >
              <span>←</span>
              Back to Public Site
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

