'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

export default function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#000000',
          color: '#ffffff',
          border: '1px solid #374151',
          borderRadius: '0',
          padding: '16px',
          fontFamily: 'var(--font-nexa), sans-serif',
        },
        success: {
          iconTheme: {
            primary: '#facc15',
            secondary: '#000000',
          },
          style: {
            border: '1px solid #facc15',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#000000',
          },
          style: {
            border: '1px solid #ef4444',
          },
        },
        loading: {
          iconTheme: {
            primary: '#facc15',
            secondary: '#000000',
          },
          style: {
            border: '1px solid #facc15',
          },
        },
      }}
    />
  );
}

