'use client';

import { ReactNode, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AosProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  return <>{children}</>;
}
