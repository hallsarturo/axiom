'use client';

import { CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { PostCardReactions } from './post-card-reactions';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { IoShareSocialOutline } from 'react-icons/io5';
import { toast } from 'sonner';

import { putBookmarkByPostId } from '@/lib/actions/actions';
import { fetchPost } from '@/lib/utils/post-card';
import { Comments } from '@/components/feed/post-card/post-card-comments';
import { requireAuth } from '@/hooks/useRequireAuth';

export function PostCardFooter({
    totalReactions,
    comments,
    shares,
    userReaction,
    reactionCounts,
    currentReactionIcon,
    handleReaction,
    postId,
    userId,
    isBookmarked,
    setIsBookmarked,
    mutatePost,
    avatarSrc,
    badge,
    ...props
}) {
    const handleBookmark = async (userId, postId) => {
        // Toggle local state immediately
        setIsBookmarked(!isBookmarked);

        let token = null;
        if (
            process.env.NODE_ENV === 'development' &&
            typeof window !== 'undefined'
        ) {
            token = localStorage.getItem('token');
        }

        // Get current state for optimistic update
        const currentIsBookmarked = isBookmarked;

        try {
            // Immediately update UI optimistically
            await mutatePost(
                async (currentData) => {
                    // Create optimistic data with toggled bookmark state
                    const optimisticData = {
                        ...currentData,
                        isBookmarked: !currentIsBookmarked,
                    };

                    // Make the actual API call
                    const res = await putBookmarkByPostId(
                        token,
                        postId,
                        userId
                    );

                    if (res.status === 200) {
                        // toast.success('Bookmark removed');
                    } else if (res.status === 201) {
                        // toast.success('Post bookmarked');
                    } else if (res.status === 500) {
                        toast.error('Could not bookmark post');
                        // If error, revert to original state
                        return currentData;
                    }

                    // Return data from actual fetch to update cache
                    const updatedData = await fetchPost(postId, token, userId);
                    return updatedData;
                },
                {
                    optimisticData: (data) => ({
                        ...data,
                        isBookmarked: !currentIsBookmarked,
                    }),
                    rollbackOnError: true,
                    populateCache: true,
                    revalidate: false, // Don't revalidate immediately as we're handling the update
                }
            );
        } catch (err) {
            setIsBookmarked(isBookmarked);
            console.error('Bookmark error:', err);
            toast.error('Error updating bookmark');
        }
    };

    return (
        <CardFooter className="justify-center">
            <div className="flex flex-col w-full gap-1.5">
                <div className="flex flex-row w-full justify-between text-sm flex-wrap">
                    <p>reactions {totalReactions}</p>
                    <p>comments {comments}</p>
                    <p>shares {shares}</p>
                </div>
                <Separator />
                <div className="flex flex-row justify-around flex-wrap">
                    <PostCardReactions
                        userReaction={userReaction}
                        reactionCounts={reactionCounts}
                        currentReactionIcon={currentReactionIcon}
                        handleReaction={handleReaction}
                    />
                    <Comments
                        post={{
                            badge,
                            type: props.type,
                            cardTitle: props.cardTitle,
                            identifier: props.identifier,
                            avatarSrc,
                            author: props.author,
                            createdAt: props.createdAt,
                            userId: props.userId,
                            description: props.description,
                            imgSrc: props.imgSrc,
                        }}
                    />
                    <Button
                        variant="ghost"
                        className="text-primary dark:text-foreground"
                        onClick={(e) => {
                            if (!requireAuth()) {
                                e.preventDefault();
                                e.stopPropagation();
                                return;
                            } else {
                                handleBookmark(userId, postId);
                            }
                        }}
                    >
                        {isBookmarked ? (
                            <FaBookmark className="size-5.5" />
                        ) : (
                            <FaRegBookmark className="size-5.5" />
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        className="text-primary dark:text-foreground flex-shrink-0"
                    >
                        <IoShareSocialOutline className="size-5.5" />
                        Share
                    </Button>
                </div>
            </div>
        </CardFooter>
    );
}
