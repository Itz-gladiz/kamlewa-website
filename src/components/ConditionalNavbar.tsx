'use client';

import { usePathname } from '@/i18n/routing';
import Navbar from './Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();

  if (pathname.startsWith('/dashboard')) {
    return null;
  }

  return <Navbar />;
}
