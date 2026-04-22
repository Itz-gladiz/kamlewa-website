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
  variant = 'dark',
  placeholderColor,
}: SelectProps) {
  const isLight = variant === 'light';
  
  const customStyles: StylesConfig<any, false, GroupBase<any>> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)',
      borderColor: state.isFocused ? (isLight ? '#000000' : '#facc15') : (isLight ? 'rgba(0, 0, 0, 0.2)' : 'rgba(55, 65, 81, 1)'),
      borderWidth: '1px',
      borderRadius: '0',
      boxShadow: state.isFocused ? (isLight ? '0 0 0 1px #000000' : '0 0 0 1px #facc15') : 'none',
      minHeight: '40px',
      '&:hover': {
        borderColor: state.isFocused ? (isLight ? '#000000' : '#facc15') : (isLight ? 'rgba(0, 0, 0, 0.3)' : 'rgba(75, 85, 99, 1)'),
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: placeholderColor || (isLight ? '#6b7280' : '#9ca3af'),
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isLight ? '#000000' : '#ffffff',
    }),
    input: (provided) => ({
      ...provided,
      color: isLight ? '#000000' : '#ffffff',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: isLight ? '#ffffff' : '#000000',
      border: isLight ? '1px solid rgba(0, 0, 0, 0.2)' : '1px solid #374151',
      borderRadius: '0',
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
        ? (isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(250, 204, 21, 0.1)')
        : 'transparent',
      color: state.isSelected ? (isLight ? '#ffffff' : '#000000') : (isLight ? '#000000' : '#ffffff'),
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
      color: state.isFocused ? (isLight ? '#000000' : '#facc15') : (isLight ? '#6b7280' : '#9ca3af'),
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
          neutral0: '#000000',
          neutral5: '#1a1a1a',
          neutral10: '#374151',
          neutral20: '#4b5563',
          neutral30: '#6b7280',
          neutral40: '#9ca3af',
          neutral50: '#d1d5db',
          neutral60: '#e5e7eb',
          neutral70: '#f3f4f6',
          neutral80: '#ffffff',
          neutral90: '#ffffff',
        },
      })}
    />
  );
}

