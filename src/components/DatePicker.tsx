'use client';

import React from 'react';
import { HiOutlineCalendarDateRange } from 'react-icons/hi2';

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
          className={`${baseStyles} ${className} pr-10`}
          {...props}
        />
        <HiOutlineCalendarDateRange className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
      </div>
    </div>
  );
}


