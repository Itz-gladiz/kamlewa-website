import { supabase } from './client';
import { Database } from './types';

type Report = Database['public']['Tables']['reports']['Row'];
type ReportInsert = Database['public']['Tables']['reports']['Insert'];
type ReportUpdate = Database['public']['Tables']['reports']['Update'];

export async function getReports() {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Report[];
}

export async function getReportById(id: string) {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Report;
}

export async function createReport(report: ReportInsert) {
  const { data, error } = await supabase
    .from('reports')
    .insert(report)
    .select()
    .single();

  if (error) throw error;
  return data as Report;
}

export async function updateReport(id: string, report: ReportUpdate) {
  const { data, error } = await supabase
    .from('reports')
    .update(report)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Report;
}

export async function deleteReport(id: string) {
  const { error } = await supabase
    .from('reports')
    .delete()
    .eq('id', id);

  if (error) throw error;
}