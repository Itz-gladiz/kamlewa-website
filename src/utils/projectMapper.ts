import { Database } from '@/lib/supabase/types';
import { Project } from '@/data/projects';

type DbProject = Database['public']['Tables']['projects']['Row'];

/**
 * Convert database project to frontend Project format
 */
export function mapDbProjectToProject(dbProject: DbProject): Project {
  return {
    id: dbProject.id,
    title: dbProject.title,
    description: dbProject.description,
    status: dbProject.status,
    image: dbProject.image,
    startDate: dbProject.start_date || undefined,
    endDate: dbProject.end_date || undefined,
    progress: dbProject.progress || undefined,
  };
}

