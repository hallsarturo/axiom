'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthSuccess() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token && process.env.NODE_ENV === 'development') {
            localStorage.setItem('token', token);
        }
        window.location.replace('/feed')
    }, [router, searchParams]);

    return null;
}
