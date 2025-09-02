import { create } from 'zustand';
import {
    getBookmarksByPostId,
    putBookmarkByPostId,
} from '@/lib/actions/actions';
import { fetchPost } from '@/lib/utils/post-card';

export const useBookmarksStore = create((set, get) => ({
    // Store structure: { [postId]: { isBookmarked, bookmarkCount, lastFetched } }
    bookmarksByPost: {},

    // Set bookmark data for a post
    setBookmarkData: (postId, data) => {
        if (!postId || !data) return;

        // Preserve existing data to avoid overwriting values
        const existingData = get().bookmarksByPost[postId] || {};

        set((state) => ({
            bookmarksByPost: {
                ...state.bookmarksByPost,
                [postId]: {
                    ...existingData,
                    isBookmarked:
                        data.isBookmarked !== undefined
                            ? data.isBookmarked
                            : existingData.isBookmarked,
                    bookmarkCount:
                        data.bookmarkCount !== undefined
                            ? data.bookmarkCount
                            : existingData.bookmarkCount,
                    lastFetched: Date.now(),
                },
            },
        }));
    },

    // Fetch bookmark count from the server
    fetchBookmarkCount: async (postId) => {
        try {
            // Add cache-busting parameter to ensure fresh data
            const timestamp = Date.now();
            const result = await getBookmarksByPostId(postId, timestamp);

            if (result) {
                // Update only the bookmarkCount in the store, preserve other values
                set((state) => {
                    const currentData = state.bookmarksByPost[postId] || {
                        isBookmarked: false,
                        bookmarkCount: 0,
                    };

                    return {
                        bookmarksByPost: {
                            ...state.bookmarksByPost,
                            [postId]: {
                                ...currentData,
                                bookmarkCount: result.bookmarkCount,
                                lastFetched: timestamp,
                            },
                        },
                    };
                });

                return result.bookmarkCount;
            }
            return 0;
        } catch (error) {
            console.error('Error fetching bookmark count:', error);
            return 0;
        }
    },

    // Handle bookmark toggle
    handleBookmark: async (postId, userId, token) => {
        if (!postId || !userId) {
            console.error('Missing required parameters for handleBookmark');
            return;
        }

        // Get current state
        const currentState = get().bookmarksByPost[postId] || {
            isBookmarked: false,
            bookmarkCount: 0,
        };

        // Optimistic update - TOGGLE the current state
        const isCurrentlyBookmarked = currentState.isBookmarked;
        const newIsBookmarked = !isCurrentlyBookmarked;
        const newBookmarkCount = Math.max(
            0,
            currentState.bookmarkCount + (newIsBookmarked ? 1 : -1)
        );

        // Update state optimistically
        set((state) => ({
            bookmarksByPost: {
                ...state.bookmarksByPost,
                [postId]: {
                    ...currentState,
                    isBookmarked: newIsBookmarked,
                    bookmarkCount: newBookmarkCount,
                },
            },
        }));

        try {
            // Make the API call
            const res = await putBookmarkByPostId(token, postId, userId);
            console.log('Bookmark toggle response:', res);

            // Instead of fetching the post again, trust our optimistic update
            // and just fetch the bookmark count
            await get().fetchBookmarkCount(postId);

            return res;
        } catch (error) {
            console.error('Error handling bookmark:', error);

            // Revert to previous state on error
            set((state) => ({
                bookmarksByPost: {
                    ...state.bookmarksByPost,
                    [postId]: currentState,
                },
            }));

            throw error;
        }
    },

    // Get bookmark data for a post
    getBookmarkData: (postId) => {
        const data = get().bookmarksByPost[postId];
        if (!data) {
            return {
                isBookmarked: false,
                bookmarkCount: 0,
            };
        }
        return data;
    },

    // Clear bookmark data for a post
    clearBookmarkData: (postId) => {
        set((state) => {
            const newBookmarksByPost = { ...state.bookmarksByPost };
            delete newBookmarksByPost[postId];
            return { bookmarksByPost: newBookmarksByPost };
        });
    },
}));
