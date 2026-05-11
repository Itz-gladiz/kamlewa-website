'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
import { getReportById } from '@/lib/supabase/reports';
import { Report, getStaticReportById } from '@/data/staticReports';

const getReportPdfUrl = (report: Report) =>
  report.pdf_url || `/reports/${report.start_year}-${report.end_year}-report.pdf`;

export default function ReportDetailsPage() {
  const params = useParams();
  const reportId = params.reportId as string;
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);

        const staticReport = getStaticReportById(reportId);
        if (staticReport) {
          setReport(staticReport);
          return;
        }

        setReport(await getReportById(reportId));
      } catch (error) {
        console.error('Error loading report:', error);
        toast.error('Report not found');
        setReport(null);
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      loadReport();
    }
  }, [reportId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-black text-white flex items-center justify-center">
          <Loader />
        </main>
        <Footer />
      </>
    );
  }

  if (!report) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Report Not Found</h1>
            <Link href="/events-impact">
              <Button variant="primary">Back to Events & Impact</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const reportLabel = `${report.start_year} - ${report.end_year}`;
  const pdfUrl = getReportPdfUrl(report);

  return (
    <>
      <Navbar />
      <main className="relative bg-black text-white">
        <PageBanner
          subheading={report.category || 'Impact Report'}
          heading={report.title || `Annual Report ${reportLabel}`}
          description={report.description || report.summary || 'Read the report summary and download the full PDF.'}
          imageUrl={report.image || undefined}
        />

        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <Link href="/events-impact">
              <Button variant="outline-white" className="mb-10">
                <HiArrowLeft className="h-5 w-5" />
                Back to Reports
              </Button>
            </Link>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-3 sm:p-4"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                  {report.image ? (
                    <Image
                      src={report.image}
                      alt={`Annual Report ${reportLabel}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <HiOutlineClipboardDocumentList className="h-20 w-20 text-gray-400" />
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-8"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-yellow-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-yellow-400">
                    {report.category || 'Report'}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-gray-400">
                    <HiClock className="h-4 w-4" />
                    {reportLabel}
                  </span>
                </div>

                <div>
                  <h2 className="mb-4 text-3xl font-bold md:text-4xl" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                    {report.title}
                  </h2>
                  <p className="text-lg leading-relaxed text-gray-300">
                    {report.description || 'No description has been added for this report yet.'}
                  </p>
                </div>

                <div className="border border-white/10 bg-white/[0.03] p-6">
                  <h3 className="mb-3 text-xl font-bold text-yellow-400">Summary</h3>
                  <p className="whitespace-pre-line text-base leading-relaxed text-gray-200">
                    {report.summary || 'No summary has been added for this report yet.'}
                  </p>
                </div>

                <a
                  href={pdfUrl}
                  download
                  className="inline-flex w-full items-center justify-center gap-2 bg-yellow-400 px-5 py-4 text-sm font-bold text-black transition-colors hover:bg-yellow-300 sm:w-auto"
                >
                  <HiDownload className="h-5 w-5" />
                  Download Full Report (PDF)
                </a>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
