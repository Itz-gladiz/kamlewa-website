import { supabase } from './client';
import { Database } from './types';

type Program = Database['public']['Tables']['programs']['Row'];
type ProgramInsert = Database['public']['Tables']['programs']['Insert'];
type ProgramUpdate = Database['public']['Tables']['programs']['Update'];

export async function getPrograms() {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Program[];
}

export async function getProgramById(id: string) {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Program;
}

export async function createProgram(program: ProgramInsert) {
  const { data, error } = await supabase
    .from('programs')
    .insert(program)
    .select()
    .single();

  if (error) throw error;
  return data as Program;
}

export async function updateProgram(id: string, program: ProgramUpdate) {
  const { data, error } = await supabase
    .from('programs')
    .update(program)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Program;
}

export async function deleteProgram(id: string) {
  const { error } = await supabase
    .from('programs')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

