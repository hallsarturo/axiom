import { create } from 'zustand';
import { getCommentsByPostId, publishComment } from '@/lib/actions/actions';

// Create a store to manage comments for multiple posts
export const useCommentsStore = create((set, get) => ({
    // Store structure: { [postId]: { comments: [], totalCount: 0, pagination: {} } }
    commentsByPost: {},

    // Fetch comments for a post
    fetchComments: async (postId, page = 1, pageSize = 20) => {
        try {
            const response = await getCommentsByPostId(postId, page, pageSize);
            if (response.comments) {
                set((state) => ({
                    commentsByPost: {
                        ...state.commentsByPost,
                        [postId]: {
                            comments: response.comments,
                            totalCount: response.totalCount,
                            pagination: response.pagination,
                            lastFetched: Date.now(),
                        },
                    },
                }));
                return response;
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    },

    // Add a new comment
    addComment: async (token, postId, values, parentCommentId = null) => {
        try {
            // Add parentCommentId to values
            const commentData = {
                ...values,
                parentCommentId,
            };

            // Optimistically update UI
            const currentPostData = get().commentsByPost[postId] || {
                comments: [],
                totalCount: 0,
                pagination: {},
            };

            // Call API
            const result = await publishComment(token, postId, commentData);

            if (result.success) {
                // Fetch latest comments to ensure we have the server data
                await get().fetchComments(postId, 1, 20);
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            return { success: false, error: 'Network error' };
        }
    },

    // Get comments for a post
    getComments: (postId) => {
        return get().commentsByPost[postId] || { comments: [], totalCount: 0 };
    },

    // Manually increment comment count (for optimistic updates)
    incrementCommentCount: (postId) => {
        set((state) => {
            const currentData = state.commentsByPost[postId];
            if (!currentData) return state;

            return {
                commentsByPost: {
                    ...state.commentsByPost,
                    [postId]: {
                        ...currentData,
                        totalCount: currentData.totalCount + 1,
                    },
                },
            };
        });
    },

    // Clear comments for a post
    clearComments: (postId) => {
        set((state) => {
            const newCommentsByPost = { ...state.commentsByPost };
            delete newCommentsByPost[postId];
            return { commentsByPost: newCommentsByPost };
        });
    },
}));
