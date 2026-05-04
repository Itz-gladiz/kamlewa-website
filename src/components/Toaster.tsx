'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

export default function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#ffffff',              // ✅ light background
          color: '#111827',                   // ✅ dark text
          border: '1px solid #d1d5db',        // ✅ light gray border
          borderRadius: '0.375rem',
          padding: '16px',
          fontFamily: 'var(--font-nexa), sans-serif',
        },
        success: {
          iconTheme: {
            primary: '#facc15',               // yellow accent
            secondary: '#ffffff',             // white background for icon
          },
          style: {
            border: '1px solid #facc15',
            background: '#fefce8',            // pale yellow background
            color: '#111827',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',               // red accent
            secondary: '#ffffff',
          },
          style: {
            border: '1px solid #ef4444',
            background: '#fee2e2',            // pale red background
            color: '#111827',
          },
        },
        loading: {
          iconTheme: {
            primary: '#facc15',
            secondary: '#ffffff',
          },
          style: {
            border: '1px solid #facc15',
            background: '#fefce8',            // pale yellow background
            color: '#111827',
          },
        },
      }}
    />
  );
}
