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
  category TEXT,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
INSERT INTO public.reports (title, description, start_year, end_year, category, summary) VALUES
('2023 Annual Report', 'Comprehensive overview of Kamlewa Technologies activities in 2023', 2023, 2023, 'annual', 'A year of growth and impact'),
('2024 Impact Report', 'Measuring our social impact across communities', 2024, 2024, 'impact', 'Creating lasting change in education and technology');