import { Database } from '@/lib/supabase/types';
import { Program } from '@/data/programs';

type DbProgram = Database['public']['Tables']['programs']['Row'];

export function mapDbProgramToProgram(dbProgram: DbProgram, locale = 'en'): Program {
  const isFr = locale === 'fr';

  return {
    id: dbProgram.id,
    title: isFr
      ? (dbProgram.title_fr || dbProgram.title)
      : (dbProgram.title_en || dbProgram.title),
    description: isFr
      ? (dbProgram.description_fr || dbProgram.description)
      : (dbProgram.description_en || dbProgram.description),
    fullDescription: isFr
      ? (dbProgram.full_description_fr || dbProgram.full_description || undefined)
      : (dbProgram.full_description_en || dbProgram.full_description || undefined),
    image: dbProgram.image,
    duration: dbProgram.duration || undefined,
    participants: dbProgram.participants || undefined,
    locations: dbProgram.locations || undefined,
    category: dbProgram.category || undefined,
  };
}