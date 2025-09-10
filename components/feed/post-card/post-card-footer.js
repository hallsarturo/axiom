'use client';

import { CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { PostCardReactions } from './post-card-reactions';
import { FaRegComment, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { IoShareSocialOutline } from 'react-icons/io5';
import { toast } from 'sonner';
import { putBookmarkByPostId } from '@/lib/actions/actions';
import { fetchPost } from '@/lib/utils/post-card';
import { PostCardCommentsDialog } from '@/components/feed/post-card/post-card-comments-dialog';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useReactionsStore } from '@/lib/state/reactionsStore';
import { useBookmarksStore } from '@/lib/state/bookmarksStore';
import { useState } from 'react';

export function PostCardFooter({
    totalReactions,
    comments,
    shares,
    postId,
    userId,
    mutatePost,
    avatarSrc,
    badge,
    ...props
}) {
    const requireAuth = useRequireAuth();

    // Get bookmark data directly from Zustand store
    const { handleBookmark: storeHandleBookmark, getBookmarkData } =
        useBookmarksStore();
    const { isBookmarked, bookmarkCount } = getBookmarkData(postId);

    const token =
        process.env.NODE_ENV === 'development' && typeof window !== 'undefined'
            ? localStorage.getItem('token')
            : null;

    // Add logging to help diagnose issues
    const handleBookmarkClick = async (userId, postId) => {
        if (!requireAuth()) return;

        console.log(
            'Before bookmark toggle - isBookmarked:',
            isBookmarked,
            'count:',
            bookmarkCount
        );
        try {
            const result = await storeHandleBookmark(postId, userId, token);
            console.log('After bookmark toggle - result:', result);

            // Get fresh state after toggle
            const newState = getBookmarkData(postId);
            console.log('New bookmark state:', newState);

            // SWR mutate for consistency
            if (mutatePost) {
                mutatePost();
            }
        } catch (err) {
            console.error('Bookmark error:', err);
            toast.error('Error updating bookmark');
        }
    };

    // Manage dialog open state
    const [commentDialogOpen, setCommentDialogOpen] = useState(false);

    return (
        <CardFooter className="justify-center">
            <div className="flex flex-col w-full gap-1.5">
                <div className="flex flex-row w-full justify-between text-sm flex-wrap">
                    <p>{totalReactions} reactions</p>
                    <p>{comments} comments</p>
                    <p>{bookmarkCount} bookmarked</p>
                    <p>{shares} shares</p>
                </div>
                <Separator />
                <div className="flex flex-row justify-around flex-wrap">
                    {/* Updated to just pass postId */}
                    <PostCardReactions
                        type="post"
                        triggerIconSizeClass="size-5.5"
                        contentIconSizeClass="size-4.5"
                        postId={postId}
                        commentDialogOpen={commentDialogOpen}
                    />

                    {/* Comments button/dialog */}
                    {props.insideDialog ? (
                        <Button
                            variant="ghost"
                            className=" text-muted-foreground"
                            disabled={true}
                        >
                            <FaRegComment className="size-5.5" />
                        </Button>
                    ) : (
                        <PostCardCommentsDialog
                            post={{
                                badge,
                                type: props.type,
                                cardTitle: props.cardTitle,
                                identifier: props.identifier,
                                avatarSrc,
                                author: props.author,
                                createdAt: props.createdAt,
                                userId: props.userId,
                                postId: postId,
                                description: props.description,
                                imgSrc: props.imgSrc,
                            }}
                            commentDialogOpen={commentDialogOpen}
                            setCommentDialogOpen={setCommentDialogOpen}
                        />
                    )}

                    {/* Bookmark button - using store state directly */}
                    <Button
                        variant="ghost"
                        className="text-primary dark:text-foreground"
                        onClick={() => handleBookmarkClick(userId, postId)}
                    >
                        {isBookmarked ? (
                            <FaBookmark className="size-5.5" />
                        ) : (
                            <FaRegBookmark className="size-5.5" />
                        )}
                    </Button>

                    {/* Share button */}
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
