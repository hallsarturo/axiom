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
                        data.bookmarkCount !== undefined ||
                        data.totalBookmarks !== undefined
                            ? data.bookmarkCount || data.totalBookmarks
                            : existingData.bookmarkCount,
                    lastFetched: Date.now(),
                },
            },
        }));
    },

    // Initialize bookmark state from props
    initFromProps: (postId, isBookmarked, totalBookmarks) => {
        if (postId === undefined) return;

        // Only initialize if we don't already have data for this post
        // or if the data is explicitly provided (not undefined)
        set((state) => {
            const existingData = state.bookmarksByPost[postId] || {};

            return {
                bookmarksByPost: {
                    ...state.bookmarksByPost,
                    [postId]: {
                        ...existingData,
                        isBookmarked:
                            isBookmarked !== undefined
                                ? isBookmarked
                                : existingData.isBookmarked !== undefined
                                  ? existingData.isBookmarked
                                  : false,
                        bookmarkCount:
                            totalBookmarks !== undefined
                                ? totalBookmarks
                                : existingData.bookmarkCount !== undefined
                                  ? existingData.bookmarkCount
                                  : 0,
                        lastFetched: existingData.lastFetched || Date.now(),
                    },
                },
            };
        });
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

            // Important: Update the stored bookmark state with the server response
            if (res.success) {
                set((state) => ({
                    bookmarksByPost: {
                        ...state.bookmarksByPost,
                        [postId]: {
                            ...state.bookmarksByPost[postId],
                            isBookmarked: newIsBookmarked,
                            bookmarkCount: newBookmarkCount,
                        },
                    },
                }));
            } else {
                console.error('Failed to update bookmark on server:', res);

                // Revert to previous state on error
                set((state) => ({
                    bookmarksByPost: {
                        ...state.bookmarksByPost,
                        [postId]: currentState,
                    },
                }));
            }

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
