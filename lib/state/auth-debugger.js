'use client';

import { useEffect } from 'react';
import { useUser } from '@/context/UserProfileContext';
import { logoutUser } from '@/lib/actions/client-actions';
import { Button } from '@/components/ui/button';

export function AuthDebugger() {
    const { user } = useUser();

    useEffect(() => {
        async function checkAuthState() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/verify-auth`,
                    {
                        credentials: 'include',
                    }
                );
                console.log('Auth check response:', await res.json());
            } catch (err) {
                console.error('Auth check error:', err);
            }
        }
        checkAuthState();
    }, []);

    const handleLogout = async () => {
        const result = await logoutUser();
        if (result.success) {
            // Clear localStorage token (for development)
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }

            // Force page reload to clear any cached state
            window.location.href = '/sign-in';
        }
    };

    return (
        <div className="text-xs text-muted-foreground">
            Auth state:{' '}
            {user ? (
                <>
                    Logged in as {user.username}{' '}
                    <Button
                        variant="link"
                        className="underline px-1 py-0 h-auto text-xs"
                        onClick={handleLogout}
                    >
                        {' '}
                        (Logout)
                    </Button>
                </>
            ) : (
                'Login with your ORCID or Google account'
            )}
        </div>
    );
}
