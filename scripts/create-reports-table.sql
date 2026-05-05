-- Create the reports table for storing annual reports, impact reports, etc.
-- Run this SQL in your Supabase SQL Editor

-- Create the reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_year INTEGER NOT NULL,
  end_year INTEGER NOT NULL,
  image TEXT,
  pdf_url TEXT,
  category TEXT,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add PDF download support to existing reports tables.
ALTER TABLE public.reports
ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- Enable Row Level Security
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (everyone can view reports)
CREATE POLICY "Reports are viewable by everyone"
ON public.reports FOR SELECT
USING (true);

-- Create policy for authenticated users to insert reports
CREATE POLICY "Authenticated users can insert reports"
ON public.reports FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Create policy for authenticated users to update reports
CREATE POLICY "Authenticated users can update reports"
ON public.reports FOR UPDATE
WITH CHECK (auth.role() = 'authenticated');

-- Create policy for authenticated users to delete reports
CREATE POLICY "Authenticated users can delete reports"
ON public.reports FOR DELETE
WITH CHECK (auth.role() = 'authenticated');

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reports_category ON public.reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_start_year ON public.reports(start_year);
CREATE INDEX IF NOT EXISTS idx_reports_end_year ON public.reports(end_year);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);

-- Add a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Optional: Insert some sample data
INSERT INTO public.reports (title, description, start_year, end_year, image, pdf_url, category, summary) VALUES
('Annual Report 2023-2024', 'A visual overview of KAMLEWA Technologies activities, reach, and impact for 2023-2024.', 2023, 2024, '/reports/2023-2024-report.png', '/reports/2023-2024-report.pdf', 'annual', 'A year of growth and impact'),
('Annual Report 2024-2025', 'A visual overview of KAMLEWA Technologies activities, reach, and impact for 2024-2025.', 2024, 2025, '/reports/2024-2025-report.png', '/reports/2024-2025-report.pdf', 'annual', 'Continuing community impact through cyber safety and digital inclusion');
