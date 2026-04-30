'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/Button';
import Input from '@/components/Input';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import Image from 'next/image';
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiDocumentText,
  HiEye,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import DashboardModal from '@/components/DashboardModal';
import Loader from '@/components/Loader';
import { getReports, createReport, updateReport, deleteReport } from '@/lib/supabase/reports';
import { Database } from '@/lib/supabase/types';

<<<<<<< HEAD

import {
  getReports,
  createReport,
  updateReport,
  deleteReport,
} from '@/lib/supabase/reports';


interface Report {
  id: string;
  title: string;
  description: string | null;
  start_year: number;
  end_year: number;
  image: string | null;
  category: string | null;
  summary: string | null;
  created_at: string;
  updated_at: string;
}
=======
type Report = Database['public']['Tables']['reports']['Row'];
type ReportInsert = Database['public']['Tables']['reports']['Insert'];
type ReportUpdate = Database['public']['Tables']['reports']['Update'];
>>>>>>> ef458018bf23a402fd97351c95d17b92c8e6919e

export default function ReportsPage() {
  const t = useTranslations('dashboard');

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [viewingReport, setViewingReport] = useState<Report | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_year: new Date().getFullYear(),
    end_year: new Date().getFullYear(),
    image: '',
    category: '',
    summary: '',
  });

  const currentYear = new Date().getFullYear();

  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const categoryOptions = [
    { value: 'annual', label: 'Annual Report' },
    { value: 'impact', label: 'Impact Report' },
    { value: 'financial', label: 'Financial Report' },
    { value: 'program', label: 'Program Report' },
    { value: 'research', label: 'Research Report' },
    { value: 'other', label: 'Other' },
  ];

<<<<<<< HEAD
  // LOAD REPORTS FROM SUPABASE
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const data = await getReports();

      setReports(data);
    } catch (error: unknown) {
      const err = error as { message?: string; code?: string };
      // Handle Supabase table not existing (401) or relation does not exist
      if (err.message?.includes('relation') || err.code === 'PGRST116') {
        console.warn('Reports table not found. Please create it in Supabase.');
        setReports([]);
      } else {
        console.error('Error loading reports:', error);
        toast.error('Failed to load reports');
      }
=======
  // Load reports from Supabase
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await getReports();
      setReports(data);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Failed to load reports');
>>>>>>> ef458018bf23a402fd97351c95d17b92c8e6919e
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (report?: Report) => {
    if (report) {
      setEditingReport(report);

      setFormData({
        title: report.title,
<<<<<<< HEAD
        description: report.description || '',
        start_year: report.start_year,
        end_year: report.end_year,
        image: report.image || '',
        category: report.category || '',
=======
        description: report.description,
        startYear: report.start_year,
        endYear: report.end_year,
        image: report.image || '',
        category: report.category,
>>>>>>> ef458018bf23a402fd97351c95d17b92c8e6919e
        summary: report.summary || '',
      });
    } else {
      setEditingReport(null);

      setFormData({
        title: '',
        description: '',
        start_year: currentYear,
        end_year: currentYear,
        image: '',
        category: '',
        summary: '',
      });
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReport(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'start_year' || name === 'end_year'
          ? parseInt(value)
          : value,
    }));
  };

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      image: url,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.category
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
<<<<<<< HEAD
      // Format data for Supabase - convert empty strings to null
      const reportData = {
        title: formData.title,
        description: formData.description || null,
        start_year: formData.start_year,
        end_year: formData.end_year,
        image: formData.image || null,
        category: formData.category,
        summary: formData.summary || null,
      };

      if (editingReport) {
        // UPDATE REPORT
        const updated = await updateReport(editingReport.id, reportData);

        setReports((prev) =>
          prev.map((report) =>
            report.id === editingReport.id ? updated : report
          )
        );

        toast.success('Report updated successfully');
      } else {
        // CREATE REPORT
        const created = await createReport(reportData);

        setReports((prev) => [created, ...prev]);

=======
      if (editingReport) {
        const updateData: ReportUpdate = {
          title: formData.title,
          description: formData.description,
          start_year: formData.startYear,
          end_year: formData.endYear,
          image: formData.image || null,
          category: formData.category,
          summary: formData.summary || null,
        };
        await updateReport(editingReport.id, updateData);
        toast.success('Report updated successfully');
      } else {
        const insertData: ReportInsert = {
          title: formData.title,
          description: formData.description,
          start_year: formData.startYear,
          end_year: formData.endYear,
          image: formData.image || null,
          category: formData.category,
          summary: formData.summary || null,
        };
        await createReport(insertData);
>>>>>>> ef458018bf23a402fd97351c95d17b92c8e6919e
        toast.success('Report created successfully');
      }

      handleCloseModal();
<<<<<<< HEAD
      fetchReports();
    } catch (error: unknown) {
  const err = error as { message?: string; code?: string; details?: string; hint?: string };
  console.error('Full error:', {
    message: err?.message,
    code: err?.code,
    details: err?.details,
    hint: err?.hint,
  });
  toast.error(`Failed to save: ${err?.message || 'Unknown error'}`);
=======
      await loadReports();
    } catch (error) {
      console.error('Error saving report:', error);
      toast.error('Failed to save report');
>>>>>>> ef458018bf23a402fd97351c95d17b92c8e6919e
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this report?')) {
      return;
    }

    const loadingToast = toast.loading('Deleting report...');
    try {
      await deleteReport(id);
<<<<<<< HEAD

      setReports((prev) =>
        prev.filter((report) => report.id !== id)
      );

      toast.success('Report deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete report');
=======
      toast.success('Report deleted successfully', { id: loadingToast });
      await loadReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report', { id: loadingToast });
>>>>>>> ef458018bf23a402fd97351c95d17b92c8e6919e
    }
  };

  const getCategoryLabel = (category: string) => {
    return (
      categoryOptions.find((c) => c.value === category)?.label ||
      category
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {t('reports') || 'Reports'}
        </h1>

        <p className="text-gray-400 mt-1">
          Manage your impact and annual reports
        </p>
      </div>

      <Button
        onClick={() => handleOpenModal()}
        className="flex items-center gap-2"
      >
        <HiPlus className="w-5 h-5" />
        Add Report
      </Button>
    </div>

    {/* Reports Grid */}
    {reports.length === 0 ? (
      <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
        <HiDocumentText className="w-16 h-16 mx-auto text-gray-600 mb-4" />

        <p className="text-gray-400 text-lg">
          No reports yet
        </p>

        <p className="text-gray-500 text-sm mt-2">
          Create your first report to get started
        </p>

        <Button
          onClick={() => handleOpenModal()}
          className="mt-4"
        >
          Create Report
        </Button>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-yellow-400/50 transition-all duration-300"
          >
            {/* Image */}
            <div className="relative h-48 bg-gray-800">
              {report.image ? (
                <Image
                  src={report.image}
                  alt={report.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <HiDocumentText className="w-16 h-16 text-gray-600" />
                </div>
              )}

<<<<<<< HEAD
              <div className="absolute top-2 right-2">
                <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 text-xs font-semibold rounded-full">
                  {getCategoryLabel(report.category || '')}
                </span>
=======
              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                  {report.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {report.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{report.start_year} - {report.end_year}</span>
                  <span>{new Date(report.created_at).toLocaleDateString()}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewingReport(report)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 text-white text-sm rounded hover:bg-white/20 transition-colors"
                  >
                    <HiEye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleOpenModal(report)}
                    className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    <HiPencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <HiTrash className="w-5 h-5" />
                  </button>
                </div>
>>>>>>> ef458018bf23a402fd97351c95d17b92c8e6919e
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                {report.title}
              </h3>

              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {report.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>
                  {report.start_year} - {report.end_year}
                </span>

                <span>
                  {new Date(report.created_at).toLocaleDateString()}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewingReport(report)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 text-white text-sm rounded hover:bg-white/20 transition-colors"
                >
                  <HiEye className="w-4 h-4" />
                  View
                </button>

                <button
                  onClick={() => handleOpenModal(report)}
                  className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <HiPencil className="w-5 h-5" />
                </button>

                <button
                  onClick={() => handleDelete(report.id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <HiTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Add/Edit Modal */}
    <DashboardModal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title={editingReport ? 'Edit Report' : 'Add New Report'}
    >

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
  <label className="block text-sm font-medium text-gray-300 mb-1">
    Report Title *
  </label>
        <Input
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter report title"
          required
        />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description *
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter report description"
            rows={4}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Start Year *
            </label>

            <select
              name="start_year"
              value={formData.start_year}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400"
              required
            >
              {yearOptions.map((year) => (
                <option
                  key={year}
                  value={year}
                  className="bg-gray-800"
                >
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              End Year *
            </label>

            <select
              name="end_year" 
              value={formData.end_year}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400"
              required
            >
              {yearOptions.map((year) => (
                <option
                  key={year}
                  value={year}
                  className="bg-gray-800"
                >
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Category *
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400"
            required
          >
            <option value="" className="bg-gray-800">
              Select category
            </option>

            {categoryOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-gray-800"
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Summary
          </label>

          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            placeholder="Enter a brief summary"
            rows={2}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Cover Image
          </label>

          <CloudinaryUpload
            value={formData.image}
            onChange={handleImageUpload}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCloseModal}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? 'Saving...'
              : editingReport
              ? 'Update Report'
              : 'Create Report'}
          </Button>
        </div>
      </form>
    </DashboardModal>

    {/* View Modal */}
    <DashboardModal
      isOpen={!!viewingReport}
      onClose={() => setViewingReport(null)}
      title={viewingReport?.title || 'Report Details'}
    >
      {viewingReport && (
        <div className="space-y-4">
          {viewingReport.image && (
            <div className="relative h-64 w-full rounded-lg overflow-hidden">
              <Image
                src={viewingReport.image}
                alt={viewingReport.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 text-sm font-semibold rounded-full">
              {getCategoryLabel(viewingReport.category || '')}
            </span>

            <span className="text-gray-400">
              {viewingReport.start_year} - {viewingReport.end_year}
            </span>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-1">
              Description
            </h4>

            <p className="text-white">
              {viewingReport.description}
            </p>
          </div>

<<<<<<< HEAD
          {viewingReport.summary && (
=======
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : editingReport ? 'Update Report' : 'Create Report'}
            </Button>
          </div>
        </form>
      </DashboardModal>

      {/* View Modal */}
      <DashboardModal
        isOpen={!!viewingReport}
        onClose={() => setViewingReport(null)}
        title={viewingReport?.title || 'Report Details'}
        size="lg"
      >
        {viewingReport && (
          <div className="space-y-4">
            {viewingReport.image && (
              <div className="relative h-64 w-full rounded-lg overflow-hidden">
                <Image
                  src={viewingReport.image}
                  alt={viewingReport.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 text-sm font-semibold rounded-full">
                {getCategoryLabel(viewingReport.category)}
              </span>
              <span className="text-gray-400">
                {viewingReport.start_year} - {viewingReport.end_year}
              </span>
            </div>

>>>>>>> ef458018bf23a402fd97351c95d17b92c8e6919e
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">
                Summary
              </h4>

              <p className="text-gray-300">
                {viewingReport.summary}
              </p>
            </div>
          )}

          <div className="text-sm text-gray-500">
            Created:{' '}
            {new Date(
              viewingReport.created_at
            ).toLocaleDateString()}
          </div>
        </div>
      )}
    </DashboardModal>
  </div>
);
}