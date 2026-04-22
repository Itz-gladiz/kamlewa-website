import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline-white' | 'outline-yellow';
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'px-8 py-4 font-semibold text-base md:text-lg transition-all duration-300 cursor-pointer relative overflow-hidden group flex items-center gap-2 whitespace-nowrap';
  
  const variants = {
    primary: 'bg-yellow-400 text-black hover:bg-yellow-500',
    secondary: 'bg-white text-black hover:bg-black hover:text-white',
    'outline-white': 'border-2 border-white text-white hover:bg-white hover:text-black',
    'outline-yellow': 'border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black',
  };

  // Animated border lines for secondary and outline variants
  const getBorderColor = () => {
    if (variant === 'secondary') return 'bg-white';
    if (variant === 'outline-white') return 'bg-white';
    if (variant === 'outline-yellow') return 'bg-yellow-400';
    return '';
  };

  const borderAnimation = variant === 'secondary' || variant === 'outline-white' || variant === 'outline-yellow' ? (
    <>
      <span className={`absolute top-0 left-0 w-full h-0.5 ${getBorderColor()} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 pointer-events-none`}></span>
      <span className={`absolute top-0 right-0 w-0.5 h-full ${getBorderColor()} transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-100 pointer-events-none`}></span>
      <span className={`absolute bottom-0 right-0 w-full h-0.5 ${getBorderColor()} transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 delay-200 pointer-events-none`}></span>
      <span className={`absolute bottom-0 left-0 w-0.5 h-full ${getBorderColor()} transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-300 pointer-events-none`}></span>
    </>
  ) : null;

  return (
    <div className="relative inline-flex group w-fit">
      {/* Shadow Box - Always visible, enhanced on hover */}
      <div className="absolute inset-0 bg-white/15 translate-x-1 translate-y-1 md:translate-x-2 md:translate-y-2 group-hover:translate-x-2 group-hover:translate-y-2 md:group-hover:translate-x-3 md:group-hover:translate-y-3 transition-all duration-300 "></div>
      
      <button
        className={`relative ${baseStyles} ${variants[variant]} ${className} group-hover:-translate-y-1 md:group-hover:-translate-y-2 transition-transform duration-300`}
        {...props}
      >
        {borderAnimation}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    </div>
  );
}
