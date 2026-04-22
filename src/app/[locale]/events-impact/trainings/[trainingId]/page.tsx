'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageBanner from '@/components/PageBanner';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { HiArrowLeft, HiShare, HiClock, HiAcademicCap, HiUser, HiCurrencyDollar } from 'react-icons/hi';
import Button from '@/components/Button';
import { Training } from '@/data/trainings';
import { getTrainingById } from '@/lib/supabase/trainings';
import { mapDbTrainingToTraining } from '@/utils/trainingMapper';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';
import { Link } from '@/i18n/routing';

export default function TrainingDetailsPage() {
  const params = useParams();
  const t = useTranslations('eventsImpact');
  
  const [training, setTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadTraining = async () => {
      try {
        setLoading(true);
        const dbTraining = await getTrainingById(params.trainingId as string);
        const mappedTraining = mapDbTrainingToTraining(dbTraining);
        setTraining(mappedTraining);
      } catch (error) {
        console.error('Error loading training:', error);
        toast.error('Training not found');
        setTraining(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (params.trainingId) {
      loadTraining();
    }
  }, [params.trainingId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!training) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Training Not Found</h1>
            <Link href="/events-impact">
              <Button variant="primary">Back to Trainings</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/events-impact/trainings/${training.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: training.title,
          text: training.description,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Link copied!');
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Link copied!');
      }
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getFormatColor = (format?: string) => {
    switch (format) {
      case 'online':
        return 'bg-blue-500/20 text-blue-400';
      case 'in-person':
        return 'bg-purple-500/20 text-purple-400';
      case 'hybrid':
        return 'bg-indigo-500/20 text-indigo-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <>
      <Navbar />
      <main className="relative bg-black text-white">
        {/* Page Banner */}
        <PageBanner
          subheading="Professional Training"
          heading={training.title}
          description={training.description}
          imageUrl={training.image}
        />

        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-8">
          <Link href="/events-impact">
            <Button variant="outline-white" className="mb-8">
              <HiArrowLeft className="w-5 h-5" />
              Back to Trainings
            </Button>
          </Link>
        </div>

        {/* Training Details */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Training Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative h-64 md:h-96 overflow-hidden"
              >
                <Image
                  src={training.image}
                  alt={training.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </motion.div>

              {/* Training Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 flex-wrap mb-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getLevelColor(training.level)}`}>
                    {training.level.charAt(0).toUpperCase() + training.level.slice(1)}
                  </span>
                  {training.format && (
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getFormatColor(training.format)}`}>
                      {training.format.charAt(0).toUpperCase() + training.format.slice(1)}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                  Training Overview
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {training.description}
                </p>
              </motion.div>

              {/* What You'll Learn */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 border border-white/10 p-6 space-y-4"
              >
                <h3 className="text-xl font-bold mb-4">What You'll Learn</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-yellow-400 mt-1">✓</span>
                      <span className="text-gray-300">Core concepts and fundamental principles</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-yellow-400 mt-1">✓</span>
                      <span className="text-gray-300">Practical skills and hands-on techniques</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-yellow-400 mt-1">✓</span>
                      <span className="text-gray-300">Industry best practices and standards</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-yellow-400 mt-1">✓</span>
                      <span className="text-gray-300">Real-world applications and case studies</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-yellow-400 mt-1">✓</span>
                      <span className="text-gray-300">Problem-solving and critical thinking</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-yellow-400 mt-1">✓</span>
                      <span className="text-gray-300">Certification preparation and assessment</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Training Curriculum */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 border border-white/10 p-6 space-y-4"
              >
                <h3 className="text-xl font-bold mb-4">Training Curriculum</h3>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Module 1: Foundations</h4>
                    <p className="text-sm">Introduction to core concepts, terminology, and fundamental principles that form the basis of the training program.</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Module 2: Practical Application</h4>
                    <p className="text-sm">Hands-on exercises and practical projects designed to reinforce learning and build real-world skills.</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Module 3: Advanced Topics</h4>
                    <p className="text-sm">Deep dive into advanced concepts, complex scenarios, and expert-level techniques for mastery.</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Module 4: Assessment & Certification</h4>
                    <p className="text-sm">Final assessment, project evaluation, and certification process to validate your skills and knowledge.</p>
                  </div>
                </div>
              </motion.div>

              {/* Prerequisites */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-yellow-400/10 border border-yellow-400/20 p-6 space-y-4"
              >
                <h3 className="text-xl font-bold mb-4 text-yellow-400">Prerequisites</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>Basic understanding of technology concepts (for intermediate/advanced levels)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>Access to required software and tools (will be provided for online sessions)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>Commitment to complete all modules and assessments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>No prior experience required for beginner-level trainings</span>
                  </li>
                </ul>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-24 space-y-6"
              >
                {/* Training Info Card */}
                <div className="bg-white/5 border border-white/10 p-6 space-y-6">
                  <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                    Training Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Level</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getLevelColor(training.level)}`}>
                        {training.level.charAt(0).toUpperCase() + training.level.slice(1)}
                      </span>
                    </div>

                    {training.duration && (
                      <div className="flex items-start gap-3">
                        <HiClock className="w-5 h-5 text-yellow-400 mt-1 shrink-0" />
                        <div>
                          <p className="text-sm text-gray-400">Duration</p>
                          <p className="text-white font-semibold">{training.duration}</p>
                        </div>
                      </div>
                    )}

                    {training.format && (
                      <div className="flex items-start gap-3">
                        <HiAcademicCap className="w-5 h-5 text-yellow-400 mt-1 shrink-0" />
                        <div>
                          <p className="text-sm text-gray-400">Format</p>
                          <p className="text-white font-semibold capitalize">{training.format}</p>
                        </div>
                      </div>
                    )}

                    {training.instructor && (
                      <div className="flex items-start gap-3">
                        <HiUser className="w-5 h-5 text-yellow-400 mt-1 shrink-0" />
                        <div>
                          <p className="text-sm text-gray-400">Instructor</p>
                          <p className="text-white font-semibold">{training.instructor}</p>
                        </div>
                      </div>
                    )}

                    {training.price && (
                      <div className="flex items-start gap-3">
                        <HiCurrencyDollar className="w-5 h-5 text-yellow-400 mt-1 shrink-0" />
                        <div>
                          <p className="text-sm text-gray-400">Price</p>
                          <p className="text-white font-semibold">{training.price}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <Link href="/contact">
                      <Button variant="primary" className="w-full">
                        Enroll Now
                      </Button>
                    </Link>
                    <Button
                      variant="outline-yellow"
                      onClick={handleShare}
                      className="w-full"
                    >
                      <HiShare className="w-5 h-5" />
                      {copied ? 'Link Copied!' : 'Share Training'}
                    </Button>
                  </div>
                </div>

                {/* Benefits Card */}
                <div className="bg-yellow-400/10 border border-yellow-400/20 p-6">
                  <h4 className="text-lg font-bold mb-3 text-yellow-400">Training Benefits</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <span>Industry-recognized certification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <span>Expert instruction and mentorship</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <span>Hands-on practical experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <span>Career advancement opportunities</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}



