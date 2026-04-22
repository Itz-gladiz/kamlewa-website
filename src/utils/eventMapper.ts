import { Database } from '@/lib/supabase/types';
import { Event, EventParticipant } from '@/data/events';

type DbEvent = Database['public']['Tables']['events']['Row'];
type DbRegistration = Database['public']['Tables']['event_registrations']['Row'];

/**
 * Convert database event to frontend Event format
 */
export function mapDbEventToEvent(dbEvent: DbEvent): Event {
  // Format date for display (convert YYYY-MM-DD to readable format)
  let formattedDate = dbEvent.date;
  try {
    const date = new Date(dbEvent.date);
    if (!isNaN(date.getTime())) {
      formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  } catch {
    // Keep original date if parsing fails
  }

  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description,
    date: formattedDate,
    location: dbEvent.location,
    image: dbEvent.image,
    type: dbEvent.type,
    participants: dbEvent.participants,
    feedback: dbEvent.feedback || undefined,
    hours: dbEvent.hours || undefined,
    summary: dbEvent.summary || undefined,
    maxParticipants: (dbEvent as any).max_participants || undefined,
    registeredParticipants: [], // Will be loaded separately if needed
    registrationOpen: (dbEvent as any).registration_open !== false,
    startTime: (dbEvent as any).start_time || undefined,
    endTime: (dbEvent as any).end_time || undefined,
    shareLink: (dbEvent as any).share_link || undefined,
  };
}

/**
 * Convert database registration to frontend EventParticipant format
 */
export function mapDbRegistrationToParticipant(dbReg: DbRegistration): EventParticipant {
  return {
    id: dbReg.id,
    name: dbReg.name,
    email: dbReg.email,
    phone: dbReg.phone || '',
    registeredAt: dbReg.registered_at,
  };
}

