'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/Button';
import Input from '@/components/Input';
import CustomSelect from '@/components/Select';
import { ContactInfo } from '@/data/contact';
import { HiPlus, HiPencil, HiTrash, HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaFacebook } from 'react-icons/fa';
import toast from 'react-hot-toast';
import DashboardModal from '@/components/DashboardModal';
import { supabase } from '@/lib/supabase/supabaseClient';

export default function ContactPage() {
  const t = useTranslations('dashboard');
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null);
  const [formData, setFormData] = useState<Partial<ContactInfo>>({
    type: 'email',
    label: '',
    value: '',
    is_primary: false,       // match DB column
    display_order: 1,        // avoid reserved keyword
  });

  const typeOptions = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'address', label: 'Address' },
    { value: 'social', label: 'Social Media' },
  ];

  const getIcon = (type: ContactInfo['type']) => {
    switch (type) {
      case 'email': return <HiMail className="w-5 h-5" />;
      case 'phone': return <HiPhone className="w-5 h-5" />;
      case 'address': return <HiLocationMarker className="w-5 h-5" />;
      case 'social': return <FaFacebook className="w-5 h-5" />;
      default: return null;
    }
  };

  // Load contacts from Supabase
  useEffect(() => {
    const fetchContacts = async () => {
      const { data, error } = await supabase.from('contact_info').select('*').order('display_order');
      if (error) {
        toast.error(error.message);
      } else {
        setContacts(data || []);
      }
    };
    fetchContacts();
  }, []);

  const handleOpenModal = (contact?: ContactInfo) => {
    if (contact) {
      setEditingContact(contact);
      setFormData(contact);
    } else {
      setEditingContact(null);
      setFormData({
        type: 'email',
        label: '',
        value: '',
        is_primary: false,
        display_order: contacts.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
    setFormData({
      type: 'email',
      label: '',
      value: '',
      is_primary: false,
      display_order: contacts.length + 1,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingContact) {
      const { error } = await supabase
        .from('contact_info')
        .update(formData)
        .eq('id', editingContact.id);

      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Contact info updated successfully');
    } else {
      const { error } = await supabase
        .from('contact_info')
        .insert([formData]);

      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Contact info created successfully');
    }

    handleCloseModal();
    const { data } = await supabase.from('contact_info').select('*').order('display_order');
    setContacts(data || []);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this contact info?')) {
      const { error } = await supabase.from('contact_info').delete().eq('id', id);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Contact info deleted successfully');
      setContacts(contacts.filter(c => c.id !== id));
    }
  };

  const sortedContacts = [...contacts].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
            Contact Information
          </h1>
          <p className="text-gray-400">Manage contact details displayed on the website</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <HiPlus className="w-5 h-5" />
          Add Contact Info
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedContacts.map((contact) => (
          <div key={contact.id} className="bg-white/5 border border-white/10 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-yellow-400">{getIcon(contact.type)}</div>
                <div>
                  <h3 className="text-lg font-bold">{contact.label}</h3>
                  {contact.is_primary && (
                    <span className="text-xs text-yellow-400 uppercase tracking-wide">Primary</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(contact)}
                  className="text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  <HiPencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <HiTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-gray-300 text-sm break-words">{contact.value}</p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="px-2 py-1 bg-white/10 uppercase tracking-wide">{contact.type}</span>
              <span>Order: {contact.display_order}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <DashboardModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingContact ? 'Edit Contact Info' : 'Create Contact Info'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <CustomSelect
              options={typeOptions}
              value={typeOptions.find(opt => opt.value === formData.type) || null}
              onChange={(option) => setFormData({ ...formData, type: option?.value as ContactInfo['type'] })}
              placeholderColor="#f3f4f6"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Label</label>
            <Input
              value={formData.label || ''}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              required
              className="w-full bg-white/10 border-white/30 placeholder-gray-400"
              placeholder="e.g., Email, Primary Phone"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Value</label>
            <Input
              value={formData.value || ''}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              required
              className="w-full bg-white/10 border-white/30 placeholder-gray-400"
              placeholder="e.g., contact@example.com"
            />
          </div>
          <Button type="submit" className="w-full">
            {editingContact ? 'Update' : 'Create'}
          </Button>
        </form>
      </DashboardModal>
    </div>
  );
}
