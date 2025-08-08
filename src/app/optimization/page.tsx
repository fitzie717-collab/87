
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OptimizationRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/attribution');
  }, [router]);

  return null; 
}
