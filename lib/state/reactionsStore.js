import { create } from 'zustand';
import {
    putPostReaction,
    putCommentReaction,
    getCommentById,
} from '@/lib/actions/actions';
import { fetchPost } from '@/lib/utils/post-card';

export const useReactionsStore = create((set, get) => ({
    reactionsByPost: {},
    reactionsByComment: {},

    setReactionData: (id, data, type = 'post') => {
        if (!id || !data) return;
        const update = {
            userReaction: data.currentUserReaction,
            reactionCounts: {
                likes: data.likes || 0,
                dislikes: data.dislikes || 0,
                laughs: data.laughs || 0,
                angers: data.angers || 0,
                totalReactions: data.totalReactions || 0,
            },
            lastFetched: Date.now(),
        };
        if (type === 'comment') {
            set((state) => ({
                reactionsByComment: {
                    ...state.reactionsByComment,
                    [id]: update,
                },
            }));
        } else {
            set((state) => ({
                reactionsByPost: { ...state.reactionsByPost, [id]: update },
            }));
        }
    },

    handlePostReaction: async (postId, type, userId, token) => {
        if (!postId || !type || !userId) {
            console.error('Missing required parameters for handleReaction');
            return;
        }

        // Get current state
        const currentState = get().reactionsByPost[postId] || {
            userReaction: null,
            reactionCounts: {
                likes: 0,
                dislikes: 0,
                laughs: 0,
                angers: 0,
                totalReactions: 0,
            },
        };

        // Determine if removing or adding reaction
        const isRemovingReaction = currentState.userReaction === type;

        // Store the action we're taking for later reference
        const actionTaken = {
            isRemoving: isRemovingReaction,
            previousReaction: currentState.userReaction,
            newReaction: isRemovingReaction ? null : type,
        };

        // Optimistic update logic (your existing code)
        const optimisticUpdate = { ...currentState };

        // If clicking the same reaction type, we're removing it
        if (isRemovingReaction) {
            // Removing reaction
            optimisticUpdate.userReaction = null;
            optimisticUpdate.reactionCounts = {
                ...currentState.reactionCounts,
                [type + 's']: Math.max(
                    0,
                    currentState.reactionCounts[type + 's'] - 1
                ),
                totalReactions: Math.max(
                    0,
                    currentState.reactionCounts.totalReactions - 1
                ),
            };
        } else {
            // Adding new reaction or changing reaction
            const oldReaction = currentState.userReaction;

            // If had a previous reaction, decrement its count
            if (oldReaction) {
                optimisticUpdate.reactionCounts = {
                    ...currentState.reactionCounts,
                    [oldReaction + 's']: Math.max(
                        0,
                        currentState.reactionCounts[oldReaction + 's'] - 1
                    ),
                    [type + 's']: currentState.reactionCounts[type + 's'] + 1,
                    // totalReactions stays the same when changing reaction type
                };
            } else {
                // Adding a brand new reaction
                optimisticUpdate.reactionCounts = {
                    ...currentState.reactionCounts,
                    [type + 's']: currentState.reactionCounts[type + 's'] + 1,
                    totalReactions:
                        currentState.reactionCounts.totalReactions + 1,
                };
            }
            optimisticUpdate.userReaction = type;
        }

        // Update state optimistically
        set((state) => ({
            reactionsByPost: {
                ...state.reactionsByPost,
                [postId]: optimisticUpdate,
            },
        }));

        try {
            // Make the API call
            await putPostReaction(token, userId, postId, type);

            // Fetch the latest data from server
            const updatedData = await fetchPost(postId, token, userId);

            // GUARANTEED user reaction state - this is the key improvement
            if (updatedData) {
                // Force the correct reaction state based on the action we took
                updatedData.currentUserReaction = actionTaken.newReaction;

                // Now set the corrected data to the store
                get().setReactionData(postId, updatedData);
            }
        } catch (error) {
            console.error('Error handling reaction:', error);

            // Revert to previous state on error
            set((state) => ({
                reactionsByPost: {
                    ...state.reactionsByPost,
                    [postId]: currentState,
                },
            }));
        }
    },

    handleCommentReaction: async (commentId, type, userId, token) => {
        if (!commentId || !type || !userId) {
            console.error('Missing required parameters for handleReaction');
            return;
        }

        // Get current state
        const currentState = get().reactionsByComment[commentId] || {
            userReaction: null,
            reactionCounts: {
                likes: 0,
                dislikes: 0,
                laughs: 0,
                angers: 0,
                totalReactions: 0,
            },
        };

        // Optimistic update - determine what changes based on current state
        const optimisticUpdate = { ...currentState };

        // If clicking the same reaction type, we're removing it
        const isRemovingReaction = currentState.userReaction === type;

        // Update reaction counts optimistically
        if (isRemovingReaction) {
            // Removing reaction
            optimisticUpdate.userReaction = null;
            optimisticUpdate.reactionCounts = {
                ...currentState.reactionCounts,
                [type + 's']: Math.max(
                    0,
                    currentState.reactionCounts[type + 's'] - 1
                ),
                totalReactions: Math.max(
                    0,
                    currentState.reactionCounts.totalReactions - 1
                ),
            };
        } else {
            // Adding new reaction or changing reaction
            const oldReaction = currentState.userReaction;

            // If had a previous reaction, decrement its count
            if (oldReaction) {
                optimisticUpdate.reactionCounts = {
                    ...currentState.reactionCounts,
                    [oldReaction + 's']: Math.max(
                        0,
                        currentState.reactionCounts[oldReaction + 's'] - 1
                    ),
                    [type + 's']: currentState.reactionCounts[type + 's'] + 1,
                    // totalReactions stays the same when changing reaction type
                };
            } else {
                // Adding a brand new reaction
                optimisticUpdate.reactionCounts = {
                    ...currentState.reactionCounts,
                    [type + 's']: currentState.reactionCounts[type + 's'] + 1,
                    totalReactions:
                        currentState.reactionCounts.totalReactions + 1,
                };
            }
            optimisticUpdate.userReaction = type;
        }

        // Update state optimistically
        set((state) => ({
            reactionsByComment: {
                ...state.reactionsByComment,
                [commentId]: optimisticUpdate,
            },
        }));

        try {
            // Make the API call
            await putCommentReaction(token, userId, commentId, type);

            // Either just keep the optimistic update:
            // No need to fetch from server since you already have optimistic updates
            // OR if you need to fetch comment data, implement a proper comment fetch:

            try {
                // Instead of fetchPost, use getCommentById (which you need to implement)
                const response = await getCommentById(commentId, token);

                if (response && response.success && response.data) {
                    get().setReactionData(commentId, response.data, 'comment');
                }
            } catch (error) {
                console.error('Error fetching updated comment data:', error);
            }
        } catch (error) {
            console.error('Error handling reaction:', error);

            // Revert to previous state on error
            set((state) => ({
                reactionsByComment: {
                    ...state.reactionsByComment,
                    [commentId]: currentState,
                },
            }));
        }
    },

    getReactionData: (id, type = 'post') => {
        const data =
            type === 'comment'
                ? get().reactionsByComment[id]
                : get().reactionsByPost[id];
        if (!data) {
            return {
                userReaction: null,
                reactionCounts: {
                    likes: 0,
                    dislikes: 0,
                    laughs: 0,
                    angers: 0,
                    totalReactions: 0,
                },
            };
        }
        return data;
    },

    clearReactionData: (id, type = 'post') => {
        set((state) => {
            if (type === 'comment') {
                const newReactionsByComment = { ...state.reactionsByComment };
                delete newReactionsByComment[id];
                return { reactionsByComment: newReactionsByComment };
            } else {
                const newReactionsByPost = { ...state.reactionsByPost };
                delete newReactionsByPost[id];
                return { reactionsByPost: newReactionsByPost };
            }
        });
    },
}));
