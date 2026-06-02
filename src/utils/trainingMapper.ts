import { Database } from '@/lib/supabase/types';
import { Training } from '@/data/trainings';

type DbTraining = Database['public']['Tables']['trainings']['Row'];

export function mapDbTrainingToTraining(dbTraining: DbTraining, locale = 'en'): Training {
  const isFr = locale === 'fr';

  return {
    id: dbTraining.id,
    title: isFr
      ? (dbTraining.title_fr || dbTraining.title)
      : (dbTraining.title_en || dbTraining.title),
    description: isFr
      ? (dbTraining.description_fr || dbTraining.description)
      : (dbTraining.description_en || dbTraining.description),
    duration: dbTraining.duration,
    level: dbTraining.level,
    image: dbTraining.image,
    instructor: dbTraining.instructor || undefined,
    price: dbTraining.price || undefined,
    format: dbTraining.format || undefined,
  };
}