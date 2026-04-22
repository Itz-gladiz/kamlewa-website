'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageBanner from '@/components/PageBanner';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { HiArrowLeft, HiShare, HiUsers, HiClock, HiAcademicCap, HiMap } from 'react-icons/hi';
import Button from '@/components/Button';
import { Program } from '@/data/programs';
import { getProgramById } from '@/lib/supabase/programs';
import { mapDbProgramToProgram } from '@/utils/programMapper';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';
import { Link } from '@/i18n/routing';

export default function ProgramDetailsPage() {
  const params = useParams();
  const t = useTranslations('programs');
  const tPage = useTranslations('eventsImpact');
  
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadProgram = async () => {
      try {
        setLoading(true);
        const dbProgram = await getProgramById(params.programId as string);
        const mappedProgram = mapDbProgramToProgram(dbProgram);
        setProgram(mappedProgram);
      } catch (error) {
        console.error('Error loading program:', error);
        toast.error('Program not found');
        setProgram(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (params.programId) {
      loadProgram();
    }
  }, [params.programId]);

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

  if (!program) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Program Not Found</h1>
            <Link href="/events-impact">
              <Button variant="primary">Back to Programs</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/events-impact/programs/${program.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: program.title,
          text: program.description,
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

  return (
    <>
      <Navbar />
      <main className="relative bg-black text-white">
        {/* Page Banner */}
        <PageBanner
          subheading={tPage('programCatalog.heading')}
          heading={program.title}
          description={program.description}
          imageUrl={program.image}
        />

        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-8">
          <Link href="/events-impact">
            <Button variant="outline-white" className="mb-8">
              <HiArrowLeft className="w-5 h-5" />
              Back to Programs
            </Button>
          </Link>
        </div>

        {/* Program Details */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Program Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative h-64 md:h-96 overflow-hidden"
              >
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </motion.div>

              {/* Program Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                  About This Program
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {program.fullDescription || program.description}
                  </p>
                </div>
              </motion.div>

              {/* Program Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 border border-white/10 p-6 space-y-4"
              >
                <h3 className="text-xl font-bold mb-4">Program Benefits</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>Hands-on learning experiences with real-world applications</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>Expert mentorship and guidance from industry professionals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>Networking opportunities with peers and industry leaders</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>Certification and recognition upon completion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>Access to resources and tools for continued learning</span>
                  </li>
                </ul>
              </motion.div>

              {/* Program Structure */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 border border-white/10 p-6 space-y-4"
              >
                <h3 className="text-xl font-bold mb-4">Program Structure</h3>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Learning Modules</h4>
                    <p>Our comprehensive curriculum covers essential topics through interactive modules, practical exercises, and collaborative projects designed to build both theoretical knowledge and practical skills.</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Assessment & Evaluation</h4>
                    <p>Participants are evaluated through continuous assessments, project submissions, and practical demonstrations to ensure mastery of key concepts and skills.</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Support & Resources</h4>
                    <p>Access to dedicated support channels, learning materials, and community forums to enhance your learning journey and address any challenges along the way.</p>
                  </div>
                </div>
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
                {/* Program Info Card */}
                <div className="bg-white/5 border border-white/10 p-6 space-y-6">
                  <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                    Program Details
                  </h3>

                  <div className="space-y-4">
                    {program.duration && (
                      <div className="flex items-start gap-3">
                        <HiClock className="w-5 h-5 text-yellow-400 mt-1 shrink-0" />
                        <div>
                          <p className="text-sm text-gray-400">Duration</p>
                          <p className="text-white font-semibold">{program.duration}</p>
                        </div>
                      </div>
                    )}

                    {program.participants && (
                      <div className="flex items-start gap-3">
                        <HiUsers className="w-5 h-5 text-yellow-400 mt-1 shrink-0" />
                        <div>
                          <p className="text-sm text-gray-400">Participants</p>
                          <p className="text-white font-semibold">{program.participants}</p>
                        </div>
                      </div>
                    )}

                    {program.locations && program.locations.length > 0 && (
                      <div className="flex items-start gap-3">
                        <HiMap className="w-5 h-5 text-yellow-400 mt-1 shrink-0" />
                        <div>
                          <p className="text-sm text-gray-400">Locations</p>
                          <p className="text-white font-semibold">{program.locations.join(', ')}</p>
                        </div>
                      </div>
                    )}

                    {program.category && (
                      <div className="flex items-start gap-3">
                        <HiAcademicCap className="w-5 h-5 text-yellow-400 mt-1 shrink-0" />
                        <div>
                          <p className="text-sm text-gray-400">Category</p>
                          <p className="text-white font-semibold">{program.category}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <Link href="/community#volunteer">
                      <Button variant="primary" className="w-full">
                        Join This Program
                      </Button>
                    </Link>
                    <Button
                      variant="outline-yellow"
                      onClick={handleShare}
                      className="w-full"
                    >
                      <HiShare className="w-5 h-5" />
                      {copied ? 'Link Copied!' : 'Share Program'}
                    </Button>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-yellow-400/10 border border-yellow-400/20 p-6">
                  <h4 className="text-lg font-bold mb-3 text-yellow-400">Interested?</h4>
                  <p className="text-gray-300 text-sm mb-4">
                    Want to learn more or get involved? Contact us to find out how you can participate in this program.
                  </p>
                  <Link href="/contact">
                    <Button variant="outline-yellow" className="w-full">
                      Contact Us
                    </Button>
                  </Link>
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


