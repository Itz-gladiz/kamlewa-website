import { supabase } from './client';
import { Database } from './types';

type Training = Database['public']['Tables']['trainings']['Row'];
type TrainingInsert = Database['public']['Tables']['trainings']['Insert'];
type TrainingUpdate = Database['public']['Tables']['trainings']['Update'];

export async function getTrainings() {
  const { data, error } = await supabase
    .from('trainings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Training[];
}

export async function getTrainingById(id: string) {
  const { data, error } = await supabase
    .from('trainings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Training;
}

export async function createTraining(training: TrainingInsert) {
  const { data, error } = await supabase
    .from('trainings')
    .insert(training)
    .select()
    .single();

  if (error) throw error;
  return data as Training;
}

export async function updateTraining(id: string, training: TrainingUpdate) {
  const { data, error } = await supabase
    .from('trainings')
    .update(training)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Training;
}

export async function deleteTraining(id: string) {
  const { error } = await supabase
    .from('trainings')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

