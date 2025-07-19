'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '@/components/context/UserProfileContext';

export default function AuthSuccess() {
    const router = useRouter();
    const [error, setError] = useState(false);

    useEffect(() => {
        router.push('/dashboard');
    }, [router]);

    return <></>;
}
