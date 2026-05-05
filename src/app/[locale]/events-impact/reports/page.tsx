'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageBanner from '@/components/PageBanner';
import Button from '@/components/Button';
import Loader from '@/components/Loader';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiClock, HiDownload } from 'react-icons/hi';
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { Link } from '@/i18n/routing';
import { getReports } from '@/lib/supabase/reports';
import { Report, mergeStaticReports } from '@/data/staticReports';

export default function ReportsArchivePage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setReports(mergeStaticReports(await getReports()));
      } catch (error) {
        console.error('Error loading reports:', error);
        toast.error('Failed to load reports');
        setReports(mergeStaticReports([]));
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  return (
    <>
      <Navbar />
      <main className="relative bg-black text-white">
        <PageBanner
          subheading="Impact Reports"
          heading="Reports"
          description="View our annual report previews and download the full PDF versions."
        />

        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <Link href="/events-impact">
              <Button variant="outline-white" className="mb-10">
                <HiArrowLeft className="h-5 w-5" />
                Back to Events & Impact
              </Button>
            </Link>

            {loading ? (
              <div className="flex min-h-[320px] items-center justify-center">
                <Loader />
              </div>
            ) : reports.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {reports.map((report, index) => {
                  const reportLabel = `${report.start_year} - ${report.end_year}`;
                  const pdfUrl = report.pdf_url || `/reports/${report.start_year}-${report.end_year}-report.pdf`;

                  return (
                    <motion.article
                      key={report.id}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.06 }}
                      className="group flex h-full flex-col overflow-hidden border border-white/10 bg-white/[0.03] transition-all duration-300 hover:border-yellow-400/50"
                    >
                      <div className="relative bg-white p-3 sm:p-4">
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                          {report.image ? (
                            <Image
                              src={report.image}
                              alt={`Annual Report ${reportLabel}`}
                              fill
                              className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gray-100">
                              <HiOutlineClipboardDocumentList className="h-16 w-16 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span className="bg-yellow-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-yellow-400">
                            {report.category || 'Annual'}
                          </span>
                          <span className="flex items-center gap-2 text-sm text-gray-400">
                            <HiClock className="h-4 w-4" />
                            {reportLabel}
                          </span>
                        </div>

                        <h2 className="mb-3 text-xl font-bold md:text-2xl" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                          {report.title || `Annual Report ${reportLabel}`}
                        </h2>
                        <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-gray-300 md:text-base">
                          {report.description || report.summary}
                        </p>

                        <a
                          href={pdfUrl}
                          download
                          className="mt-auto inline-flex items-center justify-center gap-2 bg-yellow-400 px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-yellow-300"
                          aria-label={`Download Full Report PDF for ${reportLabel}`}
                        >
                          <HiDownload className="h-5 w-5" />
                          Download Full Report (PDF)
                        </a>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            ) : (
              <div className="border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
                <HiOutlineClipboardDocumentList className="mx-auto mb-4 h-16 w-16 text-gray-600" />
                <p className="text-lg text-gray-400">No reports available yet.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
