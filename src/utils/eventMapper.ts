import { Database } from '@/lib/supabase/types';
import { Event, EventParticipant } from '@/data/events';

type DbEvent = Database['public']['Tables']['events']['Row'];
type DbRegistration = Database['public']['Tables']['event_registrations']['Row'];

export function mapDbEventToEvent(dbEvent: DbEvent, locale = 'en'): Event {
  const isFr = locale === 'fr';

  let formattedDate = dbEvent.date;
  try {
    const date = new Date(dbEvent.date);
    if (!isNaN(date.getTime())) {
      formattedDate = date.toLocaleDateString(isFr ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  } catch {
    // Keep original date if parsing fails
  }

  return {
    id: dbEvent.id,
    title: isFr
      ? (dbEvent.title_fr || dbEvent.title)
      : (dbEvent.title_en || dbEvent.title),
    description: isFr
      ? (dbEvent.description_fr || dbEvent.description)
      : (dbEvent.description_en || dbEvent.description),
    date: formattedDate,
    location: dbEvent.location,
    image: dbEvent.image,
    type: dbEvent.type,
    participants: dbEvent.participants,
    feedback: dbEvent.feedback || undefined,
    hours: dbEvent.hours || undefined,
    summary: isFr
      ? (dbEvent.summary_fr || dbEvent.summary || undefined)
      : (dbEvent.summary_en || dbEvent.summary || undefined),
    maxParticipants: (dbEvent as any).max_participants || undefined,
    registeredParticipants: [],
    registrationOpen: (dbEvent as any).registration_open !== false,
    startTime: (dbEvent as any).start_time || undefined,
    endTime: (dbEvent as any).end_time || undefined,
    shareLink: (dbEvent as any).share_link || undefined,
  };
}

export function mapDbRegistrationToParticipant(dbReg: DbRegistration): EventParticipant {
  return {
    id: dbReg.id,
    name: dbReg.name,
    email: dbReg.email,
    phone: dbReg.phone || '',
    registeredAt: dbReg.registered_at,
  };
}