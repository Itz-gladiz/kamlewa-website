import { Database } from '@/lib/supabase/types';
import { Program } from '@/data/programs';

type DbProgram = Database['public']['Tables']['programs']['Row'];

/**
 * Convert database program to frontend Program format
 */
export function mapDbProgramToProgram(dbProgram: DbProgram): Program {
  return {
    id: dbProgram.id,
    title: dbProgram.title,
    description: dbProgram.description,
    fullDescription: dbProgram.full_description || undefined,
    image: dbProgram.image,
    duration: dbProgram.duration || undefined,
    participants: dbProgram.participants || undefined,
    locations: dbProgram.locations || undefined,
    category: dbProgram.category || undefined,
  };
}



