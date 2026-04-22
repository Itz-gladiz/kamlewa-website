'use client';

import { useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function DashboardModal({ isOpen, onClose, title, children }: DashboardModalProps) {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-black border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-white/10 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-nourd), sans-serif' }}>
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-yellow-400 transition-colors p-2 hover:bg-white/10 rounded-lg"
                aria-label="Close modal"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


