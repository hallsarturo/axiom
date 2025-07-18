'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthSuccess() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [error, setError] = useState(false);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            router.push('/dashboard');
        } else {
            setError(true);

            router.push('/sign-in');
        }
    }, [token, router]);

    return (
        <div>
            {error
                ? 'No token found. Please log in again.'
                : 'Signing you in...'}
        </div>
    );
}
