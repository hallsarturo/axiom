'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import {getUserProfile} from '@/lib/actions/actions'

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

   useEffect(() => {
        async function fetchUser() {
            const userData = await getUserProfile();
            setUser(userData);
        }
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
