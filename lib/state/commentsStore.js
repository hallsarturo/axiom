import { create } from 'zustand';
import {
    getParentCommentsByPostId,
    getChildCommentsByParentId,
    publishComment,
} from '@/lib/actions/client-actions';
import { useReactionsStore } from '@/lib/state/reactionsStore';

// Create a store to manage comments for multiple posts
export const useCommentsStore = create((set, get) => ({
    // Store structure: { [postId]: { parents: [], childrenByParentId: {}, totalCount: 0, pagination: {} } }
    commentsByPost: {},

    // Track loading states
    loadingStates: {}, // { [postId]: true/false, [postId_parentId]: true/false }

    // Fetch parent comments for a post
    fetchParentComments: async (
        postId,
        page = 1,
        pageSize = 20,
        userId = null
    ) => {
        try {
            // Set loading state
            set((state) => ({
                loadingStates: { ...state.loadingStates, [postId]: true },
            }));

            const response = await getParentCommentsByPostId(
                postId,
                page,
                pageSize,
                userId
            );

            if (response && !response.error) {
                set((state) => ({
                    commentsByPost: {
                        ...state.commentsByPost,
                        [postId]: {
                            ...state.commentsByPost[postId],
                            parents: response.comments || [],
                            totalCount: response.totalCount || 0,
                            pagination: response.pagination || {},
                            lastFetched: Date.now(),
                            childrenByParentId:
                                state.commentsByPost[postId]
                                    ?.childrenByParentId || {},
                        },
                    },
                    loadingStates: { ...state.loadingStates, [postId]: false },
                }));
                // Update reactions store with comment reactions
                if (response.comments) {
                    const { setReactionData } = useReactionsStore.getState();

                    response.comments.forEach((comment) => {
                        // Make sure we have the reaction data fields populated
                        const reactionData = {
                            currentUserReaction: comment.currentUserReaction,
                            likes: comment.likesCount || 0,
                            dislikes: comment.dislikesCount || 0,
                            laughs: comment.laughsCount || 0,
                            angers: comment.angersCount || 0,
                            totalReactions: comment.totalReactions || 0,
                        };

                        setReactionData(comment.id, reactionData, 'comment');
                    });
                }

                return response;
            }

            // Clear loading on error
            set((state) => ({
                loadingStates: { ...state.loadingStates, [postId]: false },
            }));
            return response;
        } catch (error) {
            console.error('Error fetching parent comments:', error);
            // Clear loading on error
            set((state) => ({
                loadingStates: { ...state.loadingStates, [postId]: false },
            }));
        }
    },

    // Fetch child comments for a specific parent
    fetchChildComments: async (
        postId,
        parentCommentId,
        page = 1,
        pageSize = 20,
        userId = null
    ) => {
        try {
            const loadingKey = `${postId}_${parentCommentId}`;
            // Set loading state
            set((state) => ({
                loadingStates: { ...state.loadingStates, [loadingKey]: true },
            }));

            const response = await getChildCommentsByParentId(
                postId,
                parentCommentId,
                page,
                pageSize,
                userId
            );

            if (response && !response.error) {
                set((state) => {
                    // Make sure the post exists in the store
                    const postData = state.commentsByPost[postId] || {
                        parents: [],
                        totalCount: 0,
                        childrenByParentId: {},
                    };

                    return {
                        commentsByPost: {
                            ...state.commentsByPost,
                            [postId]: {
                                ...postData,
                                childrenByParentId: {
                                    ...postData.childrenByParentId,
                                    [parentCommentId]: {
                                        comments: response.comments || [],
                                        totalCount: response.totalCount || 0,
                                        pagination: response.pagination || {},
                                        lastFetched: Date.now(),
                                    },
                                },
                            },
                        },
                        loadingStates: {
                            ...state.loadingStates,
                            [loadingKey]: false,
                        },
                    };
                });

                // Update reactions store with comment reactions
                if (response.comments) {
                    const { setReactionData } = useReactionsStore.getState();

                    response.comments.forEach((comment) => {
                        // Make sure we have the reaction data fields populated
                        const reactionData = {
                            currentUserReaction: comment.currentUserReaction,
                            likes: comment.likesCount || 0,
                            dislikes: comment.dislikesCount || 0,
                            laughs: comment.laughsCount || 0,
                            angers: comment.angersCount || 0,
                            totalReactions: comment.totalReactions || 0,
                        };

                        setReactionData(comment.id, reactionData, 'comment');
                    });
                }
                return response;
            }

            // Clear loading on error
            set((state) => ({
                loadingStates: { ...state.loadingStates, [loadingKey]: false },
            }));
            return response;
        } catch (error) {
            console.error('Error fetching child comments:', error);
            const loadingKey = `${postId}_${parentCommentId}`;
            // Clear loading on error
            set((state) => ({
                loadingStates: { ...state.loadingStates, [loadingKey]: false },
            }));
        }
    },

    // Get parent comments
    getParentComments: (postId) => {
        const postData = get().commentsByPost[postId];
        return {
            comments: postData?.parents || [],
            totalCount: postData?.totalCount || 0,
            pagination: postData?.pagination || {},
            isLoading: get().loadingStates[postId] || false,
        };
    },

    // Get child comments for a specific parent
    getChildComments: (postId, parentCommentId) => {
        const postData = get().commentsByPost[postId];
        const childData = postData?.childrenByParentId?.[parentCommentId];
        const loadingKey = `${postId}_${parentCommentId}`;

        return {
            comments: childData?.comments || [],
            totalCount: childData?.totalCount || 0,
            pagination: childData?.pagination || {},
            isLoading: get().loadingStates[loadingKey] || false,
        };
    },

    // Add a new comment (parent or child)
    addComment: async (token, postId, values, parentCommentId = null) => {
        try {
            // Add parentCommentId to values
            const commentData = {
                ...values,
                parentCommentId,
            };

            // Call API
            const result = await publishComment(token, postId, commentData);

            if (result.success) {
                if (parentCommentId) {
                    // For child comments, we need to:
                    // 1. Refresh the parent comments list to update counts
                    await get().fetchParentComments(postId, 1, 20);

                    // 2. Then refresh the specific parent's children
                    await get().fetchChildComments(
                        postId,
                        parentCommentId,
                        1,
                        20
                    );
                } else {
                    // For parent comments, refresh the parent list
                    await get().fetchParentComments(postId, 1, 20);
                }
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            return { success: false, error: 'Network error' };
        }
    },

    // Check if child comments are loaded for a parent
    areChildCommentsLoaded: (postId, parentCommentId) => {
        const postData = get().commentsByPost[postId];
        return !!postData?.childrenByParentId?.[parentCommentId];
    },

    // Check if child comments are currently loading
    isLoadingChildComments: (postId, parentCommentId) => {
        const loadingKey = `${postId}_${parentCommentId}`;
        return get().loadingStates[loadingKey] || false;
    },

    // Clear comments for a post
    clearComments: (postId) => {
        set((state) => {
            const newCommentsByPost = { ...state.commentsByPost };
            delete newCommentsByPost[postId];
            return { commentsByPost: newCommentsByPost };
        });
    },

    // Get all comments for a post (both parent and child counts)
    getComments: (postId) => {
        const postData = get().commentsByPost[postId];
        return {
            // Sum up parents and all children
            totalCount: postData?.totalCount || 0,
            parents: postData?.parents || [],
            pagination: postData?.pagination || {},
            isLoading: get().loadingStates[postId] || false,
        };
    },
}));
