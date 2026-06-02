import { Database } from '@/lib/supabase/types';
import { Project } from '@/data/projects';

type DbProject = Database['public']['Tables']['projects']['Row'];

export function mapDbProjectToProject(dbProject: DbProject, locale = 'en'): Project {
  const isFr = locale === 'fr';

  return {
    id: dbProject.id,
    title: isFr
      ? (dbProject.title_fr || dbProject.title)
      : (dbProject.title_en || dbProject.title),
    description: isFr
      ? (dbProject.description_fr || dbProject.description)
      : (dbProject.description_en || dbProject.description),
    status: dbProject.status,
    image: dbProject.image,
    startDate: dbProject.start_date || undefined,
    endDate: dbProject.end_date || undefined,
    progress: dbProject.progress || undefined,
  };
}