import { supabase } from './supabaseClient';
import { Database } from './types';

type ContactInfo = Database['public']['Tables']['contact_info']['Row'];
type ContactInfoInsert = Database['public']['Tables']['contact_info']['Insert'];
type ContactInfoUpdate = Database['public']['Tables']['contact_info']['Update'];

export async function getContactInfo() {
  const { data, error } = await supabase
    .from('contact_info')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as ContactInfo[];
}

export async function getContactInfoById(id: string) {
  const { data, error } = await supabase
    .from('contact_info')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as ContactInfo;
}

export async function createContactInfo(contact: ContactInfoInsert) {
  const { data, error } = await supabase
    .from('contact_info')
    .insert(contact)
    .select()
    .single();

  if (error) throw error;
  return data as ContactInfo;
}

export async function updateContactInfo(id: string, contact: ContactInfoUpdate) {
  const { data, error } = await supabase
    .from('contact_info')
    .update(contact)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as ContactInfo;
}

export async function deleteContactInfo(id: string) {
  const { error } = await supabase
    .from('contact_info')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

