"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LessonsPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to booking page with lessons section
    router.push('/booking#lessons');
  }, [router]);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <p>Redirecting to booking page...</p>
    </div>
  );
} 