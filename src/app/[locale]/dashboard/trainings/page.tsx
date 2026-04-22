'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/Button';
import Input from '@/components/Input';
import CustomSelect from '@/components/Select';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import Image from 'next/image';
import { HiPlus, HiPencil, HiTrash, HiPhotograph, HiUser } from 'react-icons/hi';
import { PiClockCountdownFill, PiGraduationCapBold } from 'react-icons/pi';
import toast from 'react-hot-toast';
import DashboardModal from '@/components/DashboardModal';
import { getTrainings, createTraining, updateTraining, deleteTraining } from '@/lib/supabase/trainings';
import { Database } from '@/lib/supabase/types';
import Loader from '@/components/Loader';

type Training = Database['public']['Tables']['trainings']['Row'];
type TrainingInsert = Database['public']['Tables']['trainings']['Insert'];
type TrainingUpdate = Database['public']['Tables']['trainings']['Update'];

export default function TrainingsPage() {
  const t = useTranslations('dashboard');
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [formData, setFormData] = useState<Partial<TrainingInsert>>({
    title: '',
    description: '',
    duration: '',
    level: 'beginner',
    image: '',
    instructor: '',
    price: '',
    format: 'online',
  });

  // Load trainings from Supabase
  useEffect(() => {
    loadTrainings();
  }, []);

  const loadTrainings = async () => {
    try {
      setLoading(true);
      const data = await getTrainings();
      setTrainings(data);
    } catch (error) {
      console.error('Error loading trainings:', error);
      toast.error('Failed to load trainings');
    } finally {
      setLoading(false);
    }
  };

  const levelOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const formatOptions = [
    { value: 'online', label: 'Online' },
    { value: 'in-person', label: 'In-Person' },
    { value: 'hybrid', label: 'Hybrid' },
  ];

  const handleOpenModal = (training?: Training) => {
    if (training) {
      setEditingTraining(training);
      setFormData({
        title: training.title,
        description: training.description,
        duration: training.duration,
        level: training.level,
        image: training.image,
        instructor: training.instructor || '',
        price: training.price || '',
        format: training.format || 'online',
      });
    } else {
      setEditingTraining(null);
      setFormData({
        title: '',
        description: '',
        duration: '',
        level: 'beginner',
        image: '',
        instructor: '',
        price: '',
        format: 'online',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTraining(null);
    setFormData({
      title: '',
      description: '',
      duration: '',
      level: 'beginner',
      image: '',
      instructor: '',
      price: '',
      format: 'online',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    const loadingToast = toast.loading(editingTraining ? 'Updating training...' : 'Creating training...');

    try {
      if (editingTraining) {
        const updateData: TrainingUpdate = {
          title: formData.title,
          description: formData.description,
          duration: formData.duration,
          level: formData.level,
          image: formData.image,
          instructor: formData.instructor || null,
          price: formData.price || null,
          format: formData.format || null,
        };
        await updateTraining(editingTraining.id, updateData);
        toast.success('Training updated successfully', { id: loadingToast });
      } else {
        const insertData: TrainingInsert = {
          title: formData.title!,
          description: formData.description!,
          duration: formData.duration!,
          level: formData.level!,
          image: formData.image!,
          instructor: formData.instructor || null,
          price: formData.price || null,
          format: formData.format || null,
        };
        await createTraining(insertData);
        toast.success('Training created successfully', { id: loadingToast });
      }
      handleCloseModal();
      await loadTrainings();
    } catch (error) {
      console.error('Error saving training:', error);
      toast.error(editingTraining ? 'Failed to update training' : 'Failed to create training', { id: loadingToast });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this training?')) return;

    const loadingToast = toast.loading('Deleting training...');
    try {
      await deleteTraining(id);
      toast.success('Training deleted successfully', { id: loadingToast });
      await loadTrainings();
    } catch (error) {
      console.error('Error deleting training:', error);
      toast.error('Failed to delete training', { id: loadingToast });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
            {t('nav.trainings')}
          </h1>
          <p className="text-gray-400">Manage all training programs</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <HiPlus className="w-5 h-5" />
          Add Training
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading trainings...</p>
        </div>
      ) : trainings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No trainings found. Create your first training!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trainings.map((training) => (
            <div key={training.id} className="bg-white/5 border border-white/10 overflow-hidden flex h-56 group hover:border-white/20 transition-all">
              {/* Image Preview - Left Side */}
              <div className="relative w-48 h-full shrink-0 bg-white/5">
                {training.image ? (
                  <Image
                    src={training.image}
                    alt={training.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5">
                    <HiPhotograph className="w-12 h-12 text-white/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              {/* Content - Right Side */}
              <div className="flex-1 flex flex-col p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{training.title}</h3>
                    <p className="text-gray-300 text-sm line-clamp-2">{training.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleOpenModal(training)}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors p-2 hover:bg-white/10 rounded"
                      aria-label="Edit training"
                    >
                      <HiPencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(training.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-white/10 rounded"
                      aria-label="Delete training"
                    >
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm mt-auto">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <PiClockCountdownFill className="w-4 h-4" />
                    <span>{training.duration}</span>
                  </div>
                  <span className={`px-3 py-1 text-xs uppercase tracking-wide border ${
                    training.level === 'beginner' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    training.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                    'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {training.level}
                  </span>
                  {training.format && (
                    <span className="px-3 py-1 bg-white/10 border border-white/20 text-xs uppercase tracking-wide">
                      {training.format}
                    </span>
                  )}
                  {training.instructor && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <HiUser className="w-4 h-4" />
                      <span className="text-xs">{training.instructor}</span>
                    </div>
                  )}
                  {training.price && (
                    <span className="text-xs text-green-400 font-semibold">
                      {training.price}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <DashboardModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTraining ? 'Edit Training' : 'Create New Training'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white/90 uppercase tracking-wide">
              <HiPhotograph className="inline w-4 h-4 mr-2 text-yellow-400" />
              Training Image
            </label>
            <CloudinaryUpload
              value={formData.image || ''}
              onChange={(url) => setFormData({ ...formData, image: url })}
              className="mt-2"
            />
            {formData.image && (
              <p className="text-xs text-gray-400 mt-1">Image URL: {formData.image.substring(0, 50)}...</p>
            )}
          </div>

          <div className="border-t border-white/10 pt-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wide border-b border-white/10 pb-2">
                Basic Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <Input
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., Introduction to Cybersecurity"
                  className="w-full bg-white/5 border-white/20 placeholder-gray-500 focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/30 transition-all resize-none"
                  rows={3}
                  placeholder="Brief description of the training program..."
                  required
                />
              </div>
            </div>

            {/* Training Details */}
            <div className="space-y-4 border-t border-white/10 pt-6">
              <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wide border-b border-white/10 pb-2">
                Training Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Level <span className="text-red-400">*</span>
                  </label>
                  <CustomSelect
                    options={levelOptions}
                    value={levelOptions.find(opt => opt.value === formData.level) || null}
                    onChange={(option) => setFormData({ ...formData, level: option?.value as Training['level'] })}
                    placeholderColor="#9ca3af"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Format
                  </label>
                  <CustomSelect
                    options={formatOptions}
                    value={formatOptions.find(opt => opt.value === formData.format) || null}
                    onChange={(option) => setFormData({ ...formData, format: option?.value as Training['format'] })}
                    placeholderColor="#9ca3af"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Duration <span className="text-red-400">*</span>
                  </label>
                  <Input
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                    placeholder="e.g., 4 Weeks"
                    className="w-full bg-white/5 border-white/20 placeholder-gray-500 focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Instructor
                  </label>
                  <Input
                    value={formData.instructor || ''}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    placeholder="e.g., Dr. John Doe"
                    className="w-full bg-white/5 border-white/20 placeholder-gray-500 focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Price
                </label>
                <Input
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., $99 or Free"
                  className="w-full bg-white/5 border-white/20 placeholder-gray-500 focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/30 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-white/10">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleCloseModal} 
              className="flex-1"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              className="flex-1"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader size={16} />
                  {editingTraining ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                editingTraining ? 'Update Training' : 'Create Training'
              )}
            </Button>
          </div>
        </form>
      </DashboardModal>
    </div>
  );
}

