"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddEventPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to admin events page
    router.push('/admin/events/new');
  }, [router]);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <p>Redirecting to admin panel...</p>
    </div>
  );
} 