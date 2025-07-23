'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// USER ACTIONS

export async function loginUser(values) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
                credentials: 'include',
            }
        );

        if (!res.ok) {
            const { message } = await res.json();
            return { success: false, error: message };
        }

        const data = await res.json();
        revalidatePath('/feed');

        return { success: true, data };
    } catch (err) {
        console.error('Login error:', err);
        return { success: false, error: 'Network error' };
    }
}

export async function createUser(values) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/signup`,
            {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            }
        );

        if (!res.ok) {
            const { error } = await res.json();
            return { success: false, error };
        }

        const data = await res.json();

        return { success: true, data };
    } catch (err) {
        console.error('Login error: ', err);
        return { success: false, error: err };
    }
}

export async function logoutUser() {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/logout`,
            {
                method: 'POST',
                credentials: 'include',
            }
        );

        revalidatePath('/sign-in');
        return { success: true };
    } catch (err) {
        console.error('Logout error: ', err);
        return { success: false, error: 'Logout failed' };
    }
}

export async function sendOtpCode(code, token) {
    console.log('code: ', code);
    try {
        const payload = {
            ...code, // e.g. { otpSignup: '123456' }
        };

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/signup/verify`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            }
        );

        if (!res.ok) {
            const { error } = await res.json();
            return { success: false, error };
        }
        revalidatePath('/dashboard');
        const data = await res.json();
        return { success: true, data };
    } catch (err) {
        console.error('Login error: ', err);
        return { success: false, error: err };
    }
}

export async function getUserProfile(token) {
    try {
        let headers = { 'Content-Type': 'application/json' };
        // Only add Authorization header in dev, and only if running on client
        if (process.env.NODE_ENV === 'development') {
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
        }
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/`,
            {
                method: 'GET',
                headers,
                credentials: 'include',
            }
        );
        if (!res.ok) {
            //console.log('getUserProfile !res.ok', res);
            return null;
        }
        const data = await res.json();
        //console.log('getUserProfile data', data);

        if (!data.user) {
            console.error('No user found in response', res);
            return null;
        }
        return {
            user: {
                //id: user.id,
                username: data.user.username,
                //isVerified: user.isVerified,
                displayName: data.user.displayName || null,
                photoUrl: data.user.photoUrl || null,
                isLoggedIn: true,
            },
        };
    } catch (err) {
        console.error('error fetching user profile:', err);
        return null;
    }
}

// DASHBOARD ACTIONS
export async function getDashboardData() {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            }
        );

        if (!res.ok) {
            const { message } = await res.json();
            return { success: false, error: message };
        }

        const data = await res.json();
        revalidatePath('/dashboard');
        return { success: true, data };
    } catch (err) {
        console.error('getDashboardData error:', err);
        return { success: false, error: 'Network error' };
    }
}

// FEED ACTIONS
export async function getPaperPosts() {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/posts/papers`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            }
        );

        if (!res.ok) {
            const { message } = await res.json();
            return { success: false, error: message };
        }

        const data = await res.json();
        revalidatePath('/feed');
        return { success: true, data };
    } catch (err) {
        console.error('getPaperPosts error: '.err);
        return { success: false, error: 'Network error' };
    }
}
