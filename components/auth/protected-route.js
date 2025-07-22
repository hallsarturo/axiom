'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/components/context/UserProfileContext';

export function ProtectedRoute({ children }) {
    const router = useRouter();
    const { user } = useUser();

    useEffect(() => {
        if (!user) {
            router.replace('/sign-in');
        }
    }, [user, router]);

    // render a loading state while checking auth
    if (!user) {
        return <div>Loading...</div>;
    }

    return children;
}
