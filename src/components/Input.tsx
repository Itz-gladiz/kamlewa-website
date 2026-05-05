import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

export default function Input({
  className = '',
  inputRef,
  ...props
}: InputProps) {
  const baseStyles = 'px-4 py-2 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors text-sm';
  
  return (
    <input
      ref={inputRef}
      className={`${baseStyles} ${className}`}
      {...props}
    />
  );
}
