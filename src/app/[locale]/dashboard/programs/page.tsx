'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { HiPlus, HiPencil, HiTrash, HiPhotograph } from 'react-icons/hi';
import { PiClockCountdownFill } from 'react-icons/pi';
import { HiUsers } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Image from 'next/image';
import DashboardModal from '@/components/DashboardModal';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import { getPrograms, createProgram, updateProgram, deleteProgram } from '@/lib/supabase/programs';
import { Database } from '@/lib/supabase/types';
import Loader from '@/components/Loader';

type Program = Database['public']['Tables']['programs']['Row'];
type ProgramInsert = Database['public']['Tables']['programs']['Insert'];
type ProgramUpdate = Database['public']['Tables']['programs']['Update'];

export default function ProgramsPage() {
  const t = useTranslations('dashboard');
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [locationsInput, setLocationsInput] = useState('');
  const [formData, setFormData] = useState<Partial<ProgramInsert>>({
    title: '', description: '', full_description: '', image: '',
    duration: '', participants: '', locations: [], category: '',
    title_en: '', title_fr: '', description_en: '', description_fr: '',
    full_description_en: '', full_description_fr: '',
  });

  useEffect(() => { loadPrograms(); }, []);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const data = await getPrograms();
      setPrograms(data);
    } catch (error) {
      console.error('Error loading programs:', error);
      toast.error('Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (program?: Program) => {
    if (program) {
      setEditingProgram(program);
      setFormData({
        title: program.title, description: program.description,
        full_description: program.full_description || '', image: program.image,
        duration: program.duration || '', participants: program.participants || '',
        locations: program.locations || [], category: program.category || '',
        title_en: program.title_en || '', title_fr: program.title_fr || '',
        description_en: program.description_en || '', description_fr: program.description_fr || '',
        full_description_en: program.full_description_en || '', full_description_fr: program.full_description_fr || '',
      });
      setLocationsInput(program.locations?.join(', ') || '');
    } else {
      setEditingProgram(null);
      setFormData({
        title: '', description: '', full_description: '', image: '',
        duration: '', participants: '', locations: [], category: '',
        title_en: '', title_fr: '', description_en: '', description_fr: '',
        full_description_en: '', full_description_fr: '',
      });
      setLocationsInput('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProgram(null);
    setFormData({
      title: '', description: '', full_description: '', image: '',
      duration: '', participants: '', locations: [], category: '',
      title_en: '', title_fr: '', description_en: '', description_fr: '',
      full_description_en: '', full_description_fr: '',
    });
    setLocationsInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const loadingToast = toast.loading(editingProgram ? 'Updating program...' : 'Creating program...');

    const bilingualFields = {
      title_en: formData.title_en || null,
      title_fr: formData.title_fr || null,
      description_en: formData.description_en || null,
      description_fr: formData.description_fr || null,
      full_description_en: formData.full_description_en || null,
      full_description_fr: formData.full_description_fr || null,
    };

    try {
      if (editingProgram) {
        const updateData: ProgramUpdate = {
          title: formData.title, description: formData.description,
          full_description: formData.full_description || null, image: formData.image,
          duration: formData.duration || null, participants: formData.participants || null,
          locations: formData.locations && formData.locations.length > 0 ? formData.locations : null,
          category: formData.category || null, ...bilingualFields,
        };
        await updateProgram(editingProgram.id, updateData);
        toast.success('Program updated successfully', { id: loadingToast });
      } else {
        const insertData: ProgramInsert = {
          title: formData.title!, description: formData.description!,
          full_description: formData.full_description || null, image: formData.image!,
          duration: formData.duration || null, participants: formData.participants || null,
          locations: formData.locations && formData.locations.length > 0 ? formData.locations : null,
          category: formData.category || null, ...bilingualFields,
        };
        await createProgram(insertData);
        toast.success('Program created successfully', { id: loadingToast });
      }
      handleCloseModal();
      await loadPrograms();
    } catch (error) {
      console.error('Error saving program:', error);
      toast.error(editingProgram ? 'Failed to update program' : 'Failed to create program', { id: loadingToast });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    const loadingToast = toast.loading('Deleting program...');
    try {
      await deleteProgram(id);
      toast.success('Program deleted successfully', { id: loadingToast });
      await loadPrograms();
    } catch (error) {
      console.error('Error deleting program:', error);
      toast.error('Failed to delete program', { id: loadingToast });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>{t('nav.programs')}</h1>
          <p className="text-gray-400">Manage all programs and initiatives</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2"><HiPlus className="w-5 h-5" />Add Program</Button>
      </div>

      {loading ? (
        <div className="text-center py-12"><p className="text-gray-400">Loading programs...</p></div>
      ) : programs.length === 0 ? (
        <div className="text-center py-12"><p className="text-gray-400">No programs found. Create your first program!</p></div>
      ) : (
        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
          {programs.map((program) => (
            <div key={program.id} className="bg-white/5 border border-white/10 overflow-hidden flex h-58 group hover:border-white/20 transition-all">
              <div className="relative w-48 h-full flex-shrink-0 bg-white/5">
                {program.image ? <Image src={program.image} alt={program.title} fill className="object-cover" unoptimized /> : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5"><HiPhotograph className="w-12 h-12 text-white/30" /></div>}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex-1 flex flex-col p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{program.title}</h3>
                    <p className="text-gray-300 text-sm line-clamp-2">{program.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => handleOpenModal(program)} className="text-yellow-400 hover:text-yellow-300 transition-colors p-2 hover:bg-white/10 rounded" aria-label="Edit program"><HiPencil className="w-5 h-5" /></button>
                    <button onClick={() => handleDelete(program.id)} className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-white/10 rounded" aria-label="Delete program"><HiTrash className="w-5 h-5" /></button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm mt-auto">
                  {program.duration && <div className="flex items-center gap-2 text-yellow-400"><PiClockCountdownFill className="w-4 h-4" /><span>{program.duration}</span></div>}
                  {program.participants && <div className="flex items-center gap-2 text-gray-400"><HiUsers className="w-4 h-4" /><span>{program.participants}</span></div>}
                  {program.category && <span className="px-3 py-1 bg-white/10 border border-white/20 text-xs uppercase tracking-wide">{program.category}</span>}
                  {program.locations && program.locations.length > 0 && <span className="text-xs text-gray-500">{program.locations.slice(0, 2).join(', ')}{program.locations.length > 2 && ` +${program.locations.length - 2}`}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DashboardModal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProgram ? 'Edit Program' : 'Create New Program'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white/90 uppercase tracking-wide"><HiPhotograph className="inline w-4 h-4 mr-2 text-yellow-400" />Program Image</label>
            <CloudinaryUpload value={formData.image || ''} onChange={(url) => setFormData({ ...formData, image: url })} className="mt-2" />
            {formData.image && <p className="text-xs text-gray-400 mt-1">Image URL: {formData.image.substring(0, 50)}...</p>}
          </div>

          <div className="border-t border-white/10 pt-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wide border-b border-white/10 pb-2">Basic Information</h3>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Title <span className="text-red-400">*</span></label>
                <Input value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required placeholder="e.g., STEAM Clubs" className="w-full bg-white/5 border-white/20 placeholder-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Short Description <span className="text-red-400">*</span></label>
                <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 resize-none" rows={3} placeholder="Brief description..." required />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Full Description</label>
                <textarea value={formData.full_description || ''} onChange={(e) => setFormData({ ...formData, full_description: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 resize-none" rows={5} placeholder="Detailed description..." />
              </div>
            </div>

            {/* 🌍 Translations */}
            <div className="space-y-4 border-t border-white/10 pt-6">
              <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wide border-b border-white/10 pb-2">🌍 Translations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">🇬🇧 Title (English)</label>
                  <Input value={formData.title_en || ''} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} placeholder="English title" className="w-full bg-white/5 border-white/20 placeholder-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">🇫🇷 Titre (Français)</label>
                  <Input value={formData.title_fr || ''} onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })} placeholder="Titre en français" className="w-full bg-white/5 border-white/20 placeholder-gray-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">🇬🇧 Description (English)</label>
                <textarea value={formData.description_en || ''} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 resize-none" rows={3} placeholder="Description in English..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">🇫🇷 Description (Français)</label>
                <textarea value={formData.description_fr || ''} onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 resize-none" rows={3} placeholder="Description en français..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">🇬🇧 Full Description (English)</label>
                <textarea value={formData.full_description_en || ''} onChange={(e) => setFormData({ ...formData, full_description_en: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 resize-none" rows={4} placeholder="Full description in English..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">🇫🇷 Description complète (Français)</label>
                <textarea value={formData.full_description_fr || ''} onChange={(e) => setFormData({ ...formData, full_description_fr: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 resize-none" rows={4} placeholder="Description complète en français..." />
              </div>
            </div>

            {/* Program Details */}
            <div className="space-y-4 border-t border-white/10 pt-6">
              <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wide border-b border-white/10 pb-2">Program Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Duration</label>
                  <Input value={formData.duration || ''} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g., 2-4 Weeks" className="w-full bg-white/5 border-white/20 placeholder-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Participants</label>
                  <Input value={formData.participants || ''} onChange={(e) => setFormData({ ...formData, participants: e.target.value })} placeholder="e.g., 200+" className="w-full bg-white/5 border-white/20 placeholder-gray-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
                <Input value={formData.category || ''} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="e.g., Education, Training, Outreach" className="w-full bg-white/5 border-white/20 placeholder-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Locations</label>
                <Input value={locationsInput} onChange={(e) => setLocationsInput(e.target.value)} onBlur={() => { const l = locationsInput.split(',').map(x => x.trim()).filter(x => x.length > 0); setFormData({ ...formData, locations: l }); }} placeholder="Yaoundé, Douala, Buea" className="w-full bg-white/5 border-white/20 placeholder-gray-500" />
                <p className="text-xs text-gray-500 mt-1">Separate multiple locations with commas</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-white/10">
            <Button type="button" variant="secondary" onClick={handleCloseModal} className="flex-1" disabled={submitting}>Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
              {submitting ? <span className="flex items-center justify-center gap-2"><Loader size={16} />{editingProgram ? 'Updating...' : 'Creating...'}</span> : editingProgram ? 'Update Program' : 'Create Program'}
            </Button>
          </div>
        </form>
      </DashboardModal>
    </div>
  );
}