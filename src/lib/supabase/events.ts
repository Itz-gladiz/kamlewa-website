import { supabase } from './client';
import { Database } from './types';

type Event = Database['public']['Tables']['events']['Row'];
type EventInsert = Database['public']['Tables']['events']['Insert'];
type EventUpdate = Database['public']['Tables']['events']['Update'];
type EventRegistration = Database['public']['Tables']['event_registrations']['Row'];
type EventRegistrationInsert = Database['public']['Tables']['event_registrations']['Insert'];

export async function getEvents(type?: 'featured' | 'upcoming') {
  let query = supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false });

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Event[];
}

export async function getEventById(id: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Event;
}

export async function createEvent(event: EventInsert) {
  const { data, error } = await supabase
    .from('events')
    .insert(event)
    .select()
    .single();

  if (error) throw error;
  return data as Event;
}

export async function updateEvent(id: string, event: EventUpdate) {
  const { data, error } = await supabase
    .from('events')
    .update(event)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Event;
}

export async function deleteEvent(id: string) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Event Registrations
export async function registerForEvent(registration: EventRegistrationInsert) {
  const { data, error } = await supabase
    .from('event_registrations')
    .insert(registration)
    .select()
    .single();

  if (error) throw error;
  return data as EventRegistration;
}

export async function getEventRegistrations(eventId: string) {
  const { data, error } = await supabase
    .from('event_registrations')
    .select('*')
    .eq('event_id', eventId)
    .order('registered_at', { ascending: false });

  if (error) throw error;
  return data as EventRegistration[];
}

export async function updateRegistrationStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled') {
  const { data, error } = await supabase
    .from('event_registrations')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as EventRegistration;
}

