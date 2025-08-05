'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getUserProfile } from '@/lib/actions/actions';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    async function fetchUser() {
        let token = null;
        if (process.env.NODE_ENV === 'development') {
            token = localStorage.getItem('token');
        } else {
            token = null;
        }
        const userData = await getUserProfile(token);
        setUser(userData?.user || null);
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
