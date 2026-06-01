import { supabase } from './supabaseClient';

// ─── Contact Submissions ───────────────────────────────────────────────────

export async function createContactSubmission(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const { error } = await supabase.from('contact_submissions').insert({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    subject: data.subject,
    message: data.message,
  });
  if (error) throw error;
}

// ─── Volunteer Applications ────────────────────────────────────────────────

export async function createVolunteerApplication(data: {
  name: string;
  email: string;
  phone?: string;
  expertise?: string;
  availability?: string;
  message: string;
}) {
  const { error } = await supabase.from('volunteer_applications').insert({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    expertise: data.expertise || null,
    availability: data.availability || null,
    message: data.message,
  });
  if (error) throw error;
}

// ─── Partnership Inquiries ─────────────────────────────────────────────────

export async function createPartnershipInquiry(data: {
  name: string;
  email: string;
  phone?: string;
  organization: string;
  partnership_type?: string;
  message: string;
}) {
  const { error } = await supabase.from('partnership_inquiries').insert({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    organization: data.organization,
    partnership_type: data.partnership_type || null,
    message: data.message,
  });
  if (error) throw error;
}

// ─── Training Registrations ────────────────────────────────────────────────

export async function createTrainingRegistration(data: {
  training_id: string;
  training_name: string;
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  message?: string;
}) {
  const { error } = await supabase.from('training_registrations').insert({
    training_id: data.training_id,
    training_name: data.training_name,
    full_name: data.full_name,
    email: data.email,
    phone: data.phone || null,
    location: data.location || null,
    message: data.message || null,
  });
  if (error) throw error;
}