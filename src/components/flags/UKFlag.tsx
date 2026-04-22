import React from 'react';
import Image from 'next/image';

interface UKFlagProps {
  className?: string;
}

export default function UKFlag({ className = "w-5 h-5" }: UKFlagProps) {
  return (
    <Image
      src="https://img.freepik.com/free-vector/illustration-uk-flag_53876-18166.jpg"
      alt="UK Flag"
      width={20}
      height={20}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}
