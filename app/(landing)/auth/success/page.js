'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

// Create a client component that uses useSearchParams
function AuthSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token && process.env.NODE_ENV === 'development') {
            localStorage.setItem('token', token);
        }
        window.location.replace('/feed');
    }, [router, searchParams]);

    return null;
}

// Wrap the component that uses useSearchParams in Suspense
export default function AuthSuccess() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthSuccessContent />
        </Suspense>
    );
}
