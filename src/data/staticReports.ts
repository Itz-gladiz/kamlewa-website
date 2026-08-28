import { Database } from '@/lib/supabase/types';

export type Report = Database['public']['Tables']['reports']['Row'];

export const staticReports: Report[] = [
  {
    id: 'kamlewa-2023-2025-impact-report',
    title: 'KAMLEWA Technologies 2023-2025 Impact Report',
    description:
      'A visual report highlighting KAMLEWA Technologies programs, partnerships, community reach, and impact from 2023 to 2025.',
    start_year: 2023,
    end_year: 2025,
    image: '/images/2023 2025 IMPACT REPORT/cover page.png',
    pdf_url: '/KAMLEWA TECHNOLOGIES 2023 2025 IMPACT REPORT.pdf',
    category: 'Impact Report',
    summary: 'Community impact through cyber safety, digital inclusion, and knowledge sharing.',
    title_en: null,
    title_fr: null,
    description_en: null,
    description_fr: null,
    summary_en: null,
    summary_fr: null,
    created_at: '2026-05-05T00:00:00.000Z',
    updated_at: '2026-05-05T00:00:00.000Z',
  },
];

export function mergeStaticReports(reports: Report[]) {
  const existingKeys = new Set(
    reports.map((report) => `${report.start_year}-${report.end_year}-${report.title.toLowerCase()}`)
  );

  const missingStaticReports = staticReports.filter(
    (report) => !existingKeys.has(`${report.start_year}-${report.end_year}-${report.title.toLowerCase()}`)
  );

  return [...missingStaticReports, ...reports];
}

export function getStaticReportById(id: string) {
  return staticReports.find((report) => report.id === id) || null;
}
