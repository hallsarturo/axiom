'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function fetchLogin(prevState, formData) {
    
    
    console.log('From Next.js server');
    try {
        const res = await fetch('https://localhost:3010/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // include cookies for session
            body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('token', data.token);
        } else {
            const msg = await res.text();
            console.error('msg');
            //alert(`Login failed: ${msg}`);
        }
    } catch (err) {
        console.error('Login error:', err);
        //alert('Login failed due to network error');
    }
}
