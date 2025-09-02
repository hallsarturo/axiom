import { create } from 'zustand';
import { putReaction } from '@/lib/actions/actions';
import { fetchPost } from '@/lib/utils/post-card';

export const useReactionsStore = create((set, get) => ({
  // Store structure: { [postId]: { userReaction, reactionCounts, lastFetched } }
  reactionsByPost: {},
  
  // Set reaction data for a post
  setReactionData: (postId, data) => {
    if (!postId || !data) return;
    
    set((state) => ({
      reactionsByPost: {
        ...state.reactionsByPost,
        [postId]: {
          userReaction: data.currentUserReaction,
          reactionCounts: {
            likes: data.likes || 0,
            dislikes: data.dislikes || 0,
            laughs: data.laughs || 0,
            angers: data.angers || 0,
            totalReactions: data.totalReactions || 0,
          },
          lastFetched: Date.now()
        }
      }
    }));
  },
  
  // Handle user reaction (like, dislike, laugh, anger)
  handleReaction: async (postId, type, userId, token) => {
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
      }
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
        [type + 's']: Math.max(0, currentState.reactionCounts[type + 's'] - 1),
        totalReactions: Math.max(0, currentState.reactionCounts.totalReactions - 1)
      };
    } else {
      // Adding new reaction or changing reaction
      const oldReaction = currentState.userReaction;
      
      // If had a previous reaction, decrement its count
      if (oldReaction) {
        optimisticUpdate.reactionCounts = {
          ...currentState.reactionCounts,
          [oldReaction + 's']: Math.max(0, currentState.reactionCounts[oldReaction + 's'] - 1),
          [type + 's']: currentState.reactionCounts[type + 's'] + 1,
          // totalReactions stays the same when changing reaction type
        };
      } else {
        // Adding a brand new reaction
        optimisticUpdate.reactionCounts = {
          ...currentState.reactionCounts,
          [type + 's']: currentState.reactionCounts[type + 's'] + 1,
          totalReactions: currentState.reactionCounts.totalReactions + 1
        };
      }
      optimisticUpdate.userReaction = type;
    }
    
    // Update state optimistically
    set((state) => ({
      reactionsByPost: {
        ...state.reactionsByPost,
        [postId]: optimisticUpdate
      }
    }));
    
    try {
      // Make the API call
      await putReaction(token, userId, postId, type);
      
      // Fetch the latest data from server
      const updatedData = await fetchPost(postId, token, userId);
      
      // Update store with actual server data
      if (updatedData) {
        get().setReactionData(postId, updatedData);
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      
      // Revert to previous state on error
      set((state) => ({
        reactionsByPost: {
          ...state.reactionsByPost,
          [postId]: currentState
        }
      }));
    }
  },
  
  // Get reaction data for a post
  getReactionData: (postId) => {
    const data = get().reactionsByPost[postId];
    if (!data) {
      return {
        userReaction: null,
        reactionCounts: {
          likes: 0,
          dislikes: 0,
          laughs: 0,
          angers: 0,
          totalReactions: 0
        }
      };
    }
    return data;
  },
  
  // Clear reaction data for a post
  clearReactionData: (postId) => {
    set((state) => {
      const newReactionsByPost = { ...state.reactionsByPost };
      delete newReactionsByPost[postId];
      return { reactionsByPost: newReactionsByPost };
    });
  }
}));