'use client';

import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import loaderAnimation from './loader/Tri-cube loader #3.json';

interface LoaderProps {
  size?: number;
  className?: string;
}

export default function Loader({ size = 128, className = '' }: LoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current && !animationRef.current) {
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: loaderAnimation,
      });
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ width: size, height: size }}
    />
  );
}

