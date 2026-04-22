'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageBanner from '@/components/PageBanner';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { HiArrowLeft, HiShare, HiCalendar, HiCheckCircle, HiClock } from 'react-icons/hi';
import Button from '@/components/Button';
import { Project } from '@/data/projects';
import { getProjectById } from '@/lib/supabase/projects';
import { mapDbProjectToProject } from '@/utils/projectMapper';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';
import { Link } from '@/i18n/routing';

export default function ProjectDetailsPage() {
  const params = useParams();
  const t = useTranslations('eventsImpact');
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        const dbProject = await getProjectById(params.projectId as string);
        const mappedProject = mapDbProjectToProject(dbProject);
        setProject(mappedProject);
      } catch (error) {
        console.error('Error loading project:', error);
        toast.error('Project not found');
        setProject(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (params.projectId) {
      loadProject();
    }
  }, [params.projectId]);

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

  if (!project) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <Link href="/events-impact">
              <Button variant="primary">Back to Projects</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/events-impact/projects/${project.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: project.title,
          text: project.description,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'upcoming':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <>
      <Navbar />
      <main className="relative bg-black text-white">
        {/* Page Banner */}
        <PageBanner
          subheading="Current Projects"
          heading={project.title}
          description={project.description}
          imageUrl={project.image}
        />

        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-8">
          <Link href="/events-impact">
            <Button variant="outline-white" className="mb-8">
              <HiArrowLeft className="w-5 h-5" />
              Back to Projects
            </Button>
          </Link>
        </div>

        {/* Project Details */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative h-64 md:h-96 overflow-hidden"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </motion.div>

              {/* Project Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(project.status)}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                  {project.progress !== undefined && (
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-yellow-400 font-semibold">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                  Project Overview
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {project.description}
                </p>
              </motion.div>

              {/* Project Objectives */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 border border-white/10 p-6 space-y-4"
              >
                <h3 className="text-xl font-bold mb-4">Project Objectives</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <HiCheckCircle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                    <span>Address critical community needs through innovative technology solutions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <HiCheckCircle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                    <span>Build sustainable infrastructure for long-term impact and growth</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <HiCheckCircle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                    <span>Empower communities with knowledge and resources for digital transformation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <HiCheckCircle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                    <span>Create measurable outcomes and positive change in target communities</span>
                  </li>
                </ul>
              </motion.div>

              {/* Project Impact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 border border-white/10 p-6 space-y-4"
              >
                <h3 className="text-xl font-bold mb-4">Expected Impact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-yellow-400 font-semibold mb-2">Community Reach</h4>
                    <p className="text-gray-300 text-sm">
                      This project aims to directly impact thousands of individuals, providing them with essential skills, resources, and opportunities for growth.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-yellow-400 font-semibold mb-2">Long-term Benefits</h4>
                    <p className="text-gray-300 text-sm">
                      Beyond immediate outcomes, this project establishes foundations for continued development and sustainable community empowerment.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-yellow-400 font-semibold mb-2">Innovation & Technology</h4>
                    <p className="text-gray-300 text-sm">
                      Leveraging cutting-edge technology and innovative approaches to solve real-world challenges and create lasting solutions.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-yellow-400 font-semibold mb-2">Partnership & Collaboration</h4>
                    <p className="text-gray-300 text-sm">
                      Working with local communities, organizations, and stakeholders to ensure project success and maximum impact.
                    </p>
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
                {/* Project Info Card */}
                <div className="bg-white/5 border border-white/10 p-6 space-y-6">
                  <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                    Project Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(project.status)}`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </div>

                    {project.startDate && (
                      <div className="flex items-start gap-3">
                        <HiCalendar className="w-5 h-5 text-yellow-400 mt-1 shrink-0" />
                        <div>
                          <p className="text-sm text-gray-400">Start Date</p>
                          <p className="text-white font-semibold">{project.startDate}</p>
                        </div>
                      </div>
                    )}

                    {project.endDate && (
                      <div className="flex items-start gap-3">
                        <HiCalendar className="w-5 h-5 text-yellow-400 mt-1 shrink-0" />
                        <div>
                          <p className="text-sm text-gray-400">End Date</p>
                          <p className="text-white font-semibold">{project.endDate}</p>
                        </div>
                      </div>
                    )}

                    {project.progress !== undefined && (
                      <div className="pt-4 border-t border-white/10">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-yellow-400 font-semibold">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-3">
                          <div
                            className="bg-yellow-400 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <Link href="/community#partnerships">
                      <Button variant="primary" className="w-full">
                        Support This Project
                      </Button>
                    </Link>
                    <Button
                      variant="outline-yellow"
                      onClick={handleShare}
                      className="w-full"
                    >
                      <HiShare className="w-5 h-5" />
                      {copied ? 'Link Copied!' : 'Share Project'}
                    </Button>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-yellow-400/10 border border-yellow-400/20 p-6">
                  <h4 className="text-lg font-bold mb-3 text-yellow-400">Get Involved</h4>
                  <p className="text-gray-300 text-sm mb-4">
                    Interested in supporting or partnering on this project? Contact us to learn more about collaboration opportunities.
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



