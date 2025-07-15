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
        revalidatePath('/feed');
        return { success: true, data };

        // localStorage.setItem('token', result.data.token);
        // revalidatePath('/feed');
        // redirect('/feed');
    } catch (err) {
        console.error('Login error:', err);
        return { success: false, error: 'Network error' };
    }
}

export async function createUser(values) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
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
        // Change it to the user Dashboard, as a wellcome
        revalidatePath('/feed');
        return { success: true, data };
    } catch (err) {
        console.error('Login error: ', err);
        return { success: false, error: 'Network error' };
    }
}

export async function logoutUser() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logut`, {
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
