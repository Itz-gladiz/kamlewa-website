'use client';

import React from 'react';
import Select, { StylesConfig, GroupBase, OptionsOrGroups } from 'react-select';

interface SelectProps {
  options: OptionsOrGroups<any, GroupBase<any>>;
  value?: any;
  onChange?: (selectedOption: any) => void;
  placeholder?: string;
  className?: string;
  isSearchable?: boolean;
  isClearable?: boolean;
  isRequired?: boolean;
  variant?: 'dark' | 'light';
  placeholderColor?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
  isSearchable = true,
  isClearable = false,
  isRequired = false,
  variant = 'light', // ✅ default to light
  placeholderColor,
}: SelectProps) {
  const isLight = variant === 'light';
  
  const customStyles: StylesConfig<any, false, GroupBase<any>> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: isLight ? '#ffffff' : '#1f2937', // ✅ solid white for light
      borderColor: state.isFocused 
        ? (isLight ? '#000000' : '#facc15') 
        : (isLight ? '#d1d5db' : '#374151'),
      borderWidth: '1px',
      borderRadius: '0.375rem',
      boxShadow: state.isFocused 
        ? (isLight ? '0 0 0 1px #000000' : '0 0 0 1px #facc15') 
        : 'none',
      minHeight: '40px',
      '&:hover': {
        borderColor: state.isFocused 
          ? (isLight ? '#000000' : '#facc15') 
          : (isLight ? '#9ca3af' : '#4b5563'),
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: placeholderColor || (isLight ? '#6b7280' : '#9ca3af'),
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isLight ? '#111827' : '#ffffff', // ✅ dark text on light
    }),
    input: (provided) => ({
      ...provided,
      color: isLight ? '#111827' : '#ffffff',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: isLight ? '#ffffff' : '#111827',
      border: isLight ? '1px solid #d1d5db' : '1px solid #374151',
      borderRadius: '0.375rem',
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '4px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? (isLight ? '#000000' : '#facc15')
        : state.isFocused
        ? (isLight ? '#f3f4f6' : 'rgba(250, 204, 21, 0.1)')
        : 'transparent',
      color: state.isSelected 
        ? (isLight ? '#ffffff' : '#000000') 
        : (isLight ? '#111827' : '#ffffff'),
      cursor: 'pointer',
      '&:active': {
        backgroundColor: isLight ? '#000000' : '#facc15',
        color: isLight ? '#ffffff' : '#000000',
      },
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused 
        ? (isLight ? '#000000' : '#facc15') 
        : (isLight ? '#6b7280' : '#9ca3af'),
      '&:hover': {
        color: isLight ? '#000000' : '#facc15',
      },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: isLight ? '#6b7280' : '#9ca3af',
      '&:hover': {
        color: isLight ? '#000000' : '#facc15',
      },
    }),
  };

  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isSearchable={isSearchable}
      isClearable={isClearable}
      required={isRequired}
      className={className}
      styles={customStyles}
      classNamePrefix="react-select"
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: '#facc15',
          primary25: 'rgba(250, 204, 21, 0.1)',
          primary50: 'rgba(250, 204, 21, 0.2)',
          primary75: 'rgba(250, 204, 21, 0.3)',
          neutral0: isLight ? '#ffffff' : '#000000', // ✅ white for light
          neutral5: isLight ? '#f9fafb' : '#1a1a1a',
          neutral10: isLight ? '#f3f4f6' : '#374151',
          neutral20: isLight ? '#e5e7eb' : '#4b5563',
          neutral30: isLight ? '#d1d5db' : '#6b7280',
          neutral40: isLight ? '#9ca3af' : '#9ca3af',
          neutral50: isLight ? '#6b7280' : '#d1d5db',
          neutral60: isLight ? '#4b5563' : '#e5e7eb',
          neutral70: isLight ? '#374151' : '#f3f4f6',
          neutral80: isLight ? '#1f2937' : '#ffffff',
          neutral90: isLight ? '#111827' : '#ffffff',
        },
      })}
    />
  );
}
