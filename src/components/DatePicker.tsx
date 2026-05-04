'use client';

import React from 'react';

interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  className?: string;
}

export default function DatePicker({ label, className = '', ...props }: DatePickerProps) {
  const baseStyles = 'px-4 py-2 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors text-sm w-full bg-white/10 border-white/30 placeholder-gray-400';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2">{label}</label>
      )}
      <div className="relative">
        <input
          type="date"
          className={`${baseStyles} ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}
