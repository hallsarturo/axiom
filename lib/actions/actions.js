'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function loginUser(values) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
            credentials: 'include',
        });

        if (!res.ok) {
            const { message } = await res.json();
            return { success: false, error: message };
        }

        const data = await res.json();

        // Save token in cookie
        document.cookie = `token=${data.token}; path=/; secure; samesite=strict`;

        revalidatePath('/feed');s
        return { success: true, data };
    } catch (err) {
        console.error('Login error:', err);
        return { success: false, error: 'Network error' };
    }
}

export async function createUser(values) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });

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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        revalidatePath('/');
        return { success: true };
    } catch (err) {
        console.error('Logout error: ', err);
        return { success: false, error: 'Logout failed' };
    }
}

export async function sendOtpCode(code, provisionalToken) {
    console.log('code: ', code);
    try {
        const payload = {
            ...code, // e.g. { otpSignup: '123456' }
        };

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/signup/verify`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${provisionalToken}`,
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
