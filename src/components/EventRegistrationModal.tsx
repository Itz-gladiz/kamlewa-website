'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiUsers, HiShare, HiCalendar, HiCheckCircle, HiClock } from 'react-icons/hi';
import { VscLocation } from 'react-icons/vsc';
import { HiOutlineCalendarDateRange } from 'react-icons/hi2';
import { Event, EventParticipant } from '@/data/events';
import Button from './Button';
import Input from './Input';
import { useTranslations } from 'next-intl';
import { downloadICS, getGoogleCalendarUrl, getOutlookCalendarUrl } from '@/utils/calendar';
import toast from 'react-hot-toast';

interface EventRegistrationModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onRegister: (participant: Omit<EventParticipant, 'id' | 'registeredAt'>) => Promise<void>;
}

export default function EventRegistrationModal({
  event,
  isOpen,
  onClose,
  onRegister,
}: EventRegistrationModalProps) {
  const t = useTranslations('events');
  const [activeTab, setActiveTab] = useState<'register' | 'participants'>('register');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const registeredCount = event.registeredParticipants?.length || 0;
  const isFull = event.maxParticipants ? registeredCount >= event.maxParticipants : false;
  const spotsLeft = event.maxParticipants ? event.maxParticipants - registeredCount : null;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFull) {
      toast.error(t('registration.full'));
      return;
    }

    setIsSubmitting(true);
    try {
      await onRegister(formData);
      toast.success(t('registration.success'));
      setFormData({ name: '', email: '', phone: '' });
      setActiveTab('participants');
    } catch (error) {
      toast.error(t('registration.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = event.shareLink || `${window.location.origin}/events-impact?event=${event.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success(t('share.copied'));
      }
    } catch (error) {
      // User cancelled or error occurred
      if (error instanceof Error && error.name !== 'AbortError') {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success(t('share.copied'));
      }
    }
  };

  const handleAddToCalendar = (provider: 'google' | 'outlook' | 'ics') => {
    if (!event.startTime || !event.endTime) {
      toast.error(t('calendar.noTime'));
      return;
    }

    const calendarEvent = {
      title: event.title,
      description: event.description,
      location: event.location,
      startTime: event.startTime,
      endTime: event.endTime,
      url: event.shareLink || window.location.href,
    };

    switch (provider) {
      case 'google':
        window.open(getGoogleCalendarUrl(calendarEvent), '_blank');
        break;
      case 'outlook':
        window.open(getOutlookCalendarUrl(calendarEvent), '_blank');
        break;
      case 'ics':
        downloadICS(calendarEvent);
        toast.success(t('calendar.downloaded'));
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-black border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-yellow-400/10 to-yellow-400/5 border-b border-white/10 p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <HiX className="w-6 h-6" />
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-white pr-8" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
              {event.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <HiOutlineCalendarDateRange className="w-4 h-4 text-yellow-400" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <VscLocation className="w-4 h-4 text-yellow-400" />
                <span>{event.location}</span>
              </div>
              {event.startTime && (
                <div className="flex items-center gap-2">
                  <HiClock className="w-4 h-4 text-yellow-400" />
                  <span>{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'register'
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('modal.register')}
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors relative ${
                activeTab === 'participants'
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('modal.participants')}
              {registeredCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-yellow-400/20 text-yellow-400 rounded-full text-xs">
                  {registeredCount}
                </span>
              )}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'register' && (
              <div className="space-y-6">
                {/* Event Info */}
                <div className="bg-white/5 border border-white/10 p-4 rounded">
                  <p className="text-gray-300 mb-4">{event.description}</p>
                  {event.maxParticipants && (
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 text-sm">
                        <HiUsers className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-300">
                          {registeredCount} / {event.maxParticipants} {t('modal.registered')}
                        </span>
                      </div>
                      {spotsLeft !== null && (
                        <span className={`text-sm font-semibold ${isFull ? 'text-red-400' : 'text-yellow-400'}`}>
                          {isFull ? t('modal.full') : `${spotsLeft} ${t('modal.spotsLeft')}`}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Registration Form */}
                {event.registrationOpen !== false && !isFull ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      type="text"
                      placeholder={t('form.name')}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-white/10 border-white/30 placeholder-gray-100! focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    />
                    <Input
                      type="email"
                      placeholder={t('form.email')}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-white/10 border-white/30 placeholder-gray-100! focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    />
                    <Input
                      type="tel"
                      placeholder={t('form.phone')}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="bg-white/10 border-white/30 placeholder-gray-100! focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? t('form.submitting') : t('form.submit')}
                    </Button>
                  </form>
                ) : (
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded text-center">
                    <p className="text-red-400 font-semibold">
                      {isFull ? t('registration.full') : t('registration.closed')}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <Button
                    variant="outline-yellow"
                    onClick={handleShare}
                    className="w-full"
                  >
                    <HiShare className="w-5 h-5" />
                    {copied ? t('share.copied') : t('share.button')}
                  </Button>
                  {event.startTime && event.endTime && (
                    <div className="relative group">
                      <Button
                        variant="outline-yellow"
                        className="w-full"
                      >
                        <HiCalendar className="w-5 h-5" />
                        {t('calendar.add')}
                      </Button>
                      {/* Calendar Dropdown */}
                      <div className="absolute top-full left-0 right-0 mt-2 bg-black border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <button
                          onClick={() => handleAddToCalendar('google')}
                          className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors"
                        >
                          Google Calendar
                        </button>
                        <button
                          onClick={() => handleAddToCalendar('outlook')}
                          className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors"
                        >
                          Outlook Calendar
                        </button>
                        <button
                          onClick={() => handleAddToCalendar('ics')}
                          className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors"
                        >
                          Download .ics
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'participants' && (
              <div className="space-y-4">
                {event.registeredParticipants && event.registeredParticipants.length > 0 ? (
                  <div className="space-y-3">
                    {event.registeredParticipants.map((participant) => (
                      <div
                        key={participant.id}
                        className="bg-white/5 border border-white/10 p-4 rounded flex items-center justify-between"
                      >
                        <div>
                          <p className="text-white font-semibold">{participant.name}</p>
                          <p className="text-gray-400 text-sm">{participant.email}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(participant.registeredAt).toLocaleDateString()}
                          </p>
                        </div>
                        <HiCheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <HiUsers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{t('modal.noParticipants')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

