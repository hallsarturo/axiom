'use client';

import { createContext, useContext, useState } from 'react';

const PostTypeContext = createContext();

export function PostTypeProvider({ children }) {
    const [postType, setPostType] = useState('papers'); // userPosts, news
    return (
        <PostTypeContext.Provider value={{ postType, setPostType }}>
            {children}
        </PostTypeContext.Provider>
    );
}

export function usePostType() {
    return useContext(PostTypeContext);
}
