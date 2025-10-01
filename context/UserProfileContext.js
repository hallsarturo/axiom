'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getUserProfile } from '@/lib/actions/client-actions';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    async function fetchUser() {
        let token = null;
        if (process.env.NODE_ENV === 'development') {
            token = localStorage.getItem('token');
        }
        try {
            const userData = await getUserProfile(token || null);
            setUser(userData?.user || null);
        } catch (err) {
            console.error('Error fetching user:', err);
            setUser(null);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, refreshUser: fetchUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
