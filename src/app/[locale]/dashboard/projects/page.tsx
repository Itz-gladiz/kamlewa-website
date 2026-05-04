'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/Button';
import Input from '@/components/Input';
import CustomSelect from '@/components/Select';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import CircularProgress from '@/components/CircularProgress';
import Image from 'next/image';
import { HiPlus, HiPencil, HiTrash, HiPhotograph, HiCalendar } from 'react-icons/hi';
import toast from 'react-hot-toast';
import DashboardModal from '@/components/DashboardModal';
import { getProjects, createProject, updateProject, deleteProject } from '@/lib/supabase/projects';
import { Database } from '@/lib/supabase/types';
import Loader from '@/components/Loader';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export default function ProjectsPage() {
  const t = useTranslations('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<ProjectInsert>>({
    title: '',
    description: '',
    status: 'active',
    image: '',
    start_date: '',
    end_date: '',
    progress: undefined,
  });

  // Load projects from Supabase
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'upcoming', label: 'Upcoming' },
  ];

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        status: project.status,
        image: project.image,
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        progress: project.progress || undefined,
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        status: 'active',
        image: '',
        start_date: '',
        end_date: '',
        progress: undefined,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      status: 'active',
      image: '',
      start_date: '',
      end_date: '',
      progress: undefined,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    const loadingToast = toast.loading(editingProject ? 'Updating project...' : 'Creating project...');

    try {
      if (editingProject) {
        const updateData: ProjectUpdate = {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          image: formData.image,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          progress: formData.progress || null,
        };
        await updateProject(editingProject.id, updateData);
        toast.success('Project updated successfully', { id: loadingToast });
      } else {
        const insertData: ProjectInsert = {
          title: formData.title!,
          description: formData.description!,
          status: formData.status!,
          image: formData.image!,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          progress: formData.progress || null,
        };
        await createProject(insertData);
        toast.success('Project created successfully', { id: loadingToast });
      }
      handleCloseModal();
      await loadProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(editingProject ? 'Failed to update project' : 'Failed to create project', { id: loadingToast });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    const loadingToast = toast.loading('Deleting project...');
    try {
      await deleteProject(id);
      toast.success('Project deleted successfully', { id: loadingToast });
      await loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project', { id: loadingToast });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
            {t('nav.projects')}
          </h1>
          <p className="text-gray-400">Manage all strategic projects</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <HiPlus className="w-5 h-5" />
          Add Project
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No projects found. Create your first project!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white/5 border border-white/10 overflow-hidden flex h-56 group hover:border-white/20 transition-all">
              {/* Image Preview - Left Side */}
              <div className="relative w-48 h-full shrink-0 bg-white/5">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
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
              <div className="flex-1 flex flex-col p-6 relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <span className={`px-3 py-1 text-xs uppercase tracking-wide mb-2 inline-block border ${
                      project.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      project.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {project.status}
                    </span>
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-300 text-sm line-clamp-2">{project.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleOpenModal(project)}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors p-2 hover:bg-white/10 rounded"
                      aria-label="Edit project"
                    >
                      <HiPencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-white/10 rounded"
                      aria-label="Delete project"
                    >
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm mt-auto">
                  {project.start_date && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <HiCalendar className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs">{project.start_date}</span>
                    </div>
                  )}
                  {project.end_date && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <HiCalendar className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs">End: {project.end_date}</span>
                    </div>
                  )}
                </div>

                {/* Circular Progress - Absolute positioned at bottom right */}
                {project.progress !== undefined && project.progress !== null && (
                  <div className="absolute bottom-4 right-4">
                    <CircularProgress progress={project.progress} size={50} strokeWidth={5} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <DashboardModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white/90 uppercase tracking-wide">
              <HiPhotograph className="inline w-4 h-4 mr-2 text-yellow-400" />
              Project Image
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
                  placeholder="e.g., Community Cyber Safety Initiative"
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
                  placeholder="Brief description of the project..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Status <span className="text-red-400">*</span>
                </label>
                <CustomSelect
                  options={statusOptions}
                  value={statusOptions.find(opt => opt.value === formData.status) || null}
                  onChange={(option) => setFormData({ ...formData, status: option?.value as Project['status'] })}
                  placeholderColor="#9ca3af"
                />
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-4 border-t border-white/10 pt-6">
              <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wide border-b border-white/10 pb-2">
                Project Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Start Date
                  </label>
                  <Input
                    value={formData.start_date || ''}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    placeholder="e.g., January 2024"
                    className="w-full bg-white/5 border-white/20 placeholder-gray-500 focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    End Date
                  </label>
                  <Input
                    value={formData.end_date || ''}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    placeholder="e.g., December 2024"
                    className="w-full bg-white/5 border-white/20 placeholder-gray-500 focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Progress (%)
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress || ''}
                    onChange={(e) => setFormData({ ...formData, progress: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="0-100"
                    className="flex-1 bg-white/5 border-white/20 placeholder-gray-500 focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/30 transition-all"
                  />
                  {formData.progress !== undefined && formData.progress !== null && (
                    <CircularProgress progress={formData.progress} size={60} strokeWidth={6} />
                  )}
                </div>
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
                  {editingProject ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                editingProject ? 'Update Project' : 'Create Project'
              )}
            </Button>
          </div>
        </form>
      </DashboardModal>
    </div>
  );
}
