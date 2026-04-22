import { Database } from '@/lib/supabase/types';
import { Training } from '@/data/trainings';

type DbTraining = Database['public']['Tables']['trainings']['Row'];

/**
 * Convert database training to frontend Training format
 */
export function mapDbTrainingToTraining(dbTraining: DbTraining): Training {
  return {
    id: dbTraining.id,
    title: dbTraining.title,
    description: dbTraining.description,
    duration: dbTraining.duration,
    level: dbTraining.level,
    image: dbTraining.image,
    instructor: dbTraining.instructor || undefined,
    price: dbTraining.price || undefined,
    format: dbTraining.format || undefined,
  };
}

