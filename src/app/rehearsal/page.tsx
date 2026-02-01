"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RehearsalPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to booking page with rehearsal section
    router.push('/booking#rehearsal');
  }, [router]);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <p>Redirecting to booking page...</p>
    </div>
  );
}