'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const PostTypeContext = createContext();

export function PostTypeProvider({ children }) {
    const [postType, setPostType] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('postType') || 'papers';
        }
        return 'papers';
    }); // userPosts, news

    // Save to local storage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('postType', postType);
        }
    }, [postType]);

    return (
        <PostTypeContext.Provider value={{ postType, setPostType }}>
            {children}
        </PostTypeContext.Provider>
    );
}

export function usePostType() {
    return useContext(PostTypeContext);
}
