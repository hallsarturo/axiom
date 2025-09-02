'use client';

import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FaRegComment } from 'react-icons/fa';
import { BiLike, BiSolidLike, BiSolidDislike } from 'react-icons/bi';
import { FaLaughBeam } from 'react-icons/fa';
import { FaFaceAngry } from 'react-icons/fa6';
import { Separator } from '@/components/ui/separator';
import { CardContent } from '@/components/ui/card';
import { PostCardHeader } from '@/components/feed/post-card/post-card-header';
import { PostCardContent } from '@/components/feed/post-card/post-card-content';
import { PostCardFooter } from '@/components/feed/post-card/post-card-footer';
import { PostCardComments } from '@/components/feed/post-card/post-card-comments';
import { PostCardCommentForm } from '@/components/feed/post-card/post-card-comment-form';
import {
    splitDescription,
    getCurrentReactionIcon,
    getBookmarkIcon,
} from '@/lib/utils/post-card';
import { capitalizeFirstLetter } from '@/lib/utils/strings';
import useSWR from 'swr';
import { fetchPost } from '@/lib/utils/post-card';
import { useState, useEffect } from 'react';
import { useUser } from '@/components/context/UserProfileContext';
import { putReaction, putBookmarkByPostId } from '@/lib/actions/actions';
import { toast } from 'sonner';

export function PostCardCommentsDialog({ post }) {
    const { user } = useUser();
    const token =
        process.env.NODE_ENV === 'development'
            ? typeof window !== 'undefined'
                ? localStorage.getItem('token')
                : null
            : null;

    // Fetch live post data
    const { data, mutate } = useSWR(
        post.postId && token && user?.id
            ? [`post-dialog`, post.postId, token, user.id]
            : null,
        ([, postId, token, userId]) => fetchPost(postId, token, userId)
    );

    const [seeMore, setSeeMore] = useState(false);
    const [part1, part2] = splitDescription(post.description);

    // Local bookmark state
    const [isLocalBookmarked, setIsLocalBookmarked] = useState(
        post.isBookmarked || false
    );

    // Update local bookmark state when data changes
    useEffect(() => {
        if (data && data.isBookmarked !== undefined) {
            setIsLocalBookmarked(data.isBookmarked);
        }
    }, [data]);

    // Use SWR data if available, else fallback to passed post
    const postData = data || post;

    // Get the bookmark icon based on the latest data
    const bookmarkIcon = getBookmarkIcon(postData?.isBookmarked);

    // Create local handlers for the dialog
    const handleDialogReaction = async (type) => {
        try {
            await mutate(
                async () => {
                    await putReaction(token, user.id, post.postId, type);
                    return await fetchPost(post.postId, token, user.id);
                },
                { revalidate: true }
            );
        } catch (err) {
            console.error('Dialog reaction error:', err);
        }
    };

    const handleDialogBookmark = async (userId, postId) => {
        // Capture current state before toggle
        const currentBookmarkState = isLocalBookmarked;

        // Optimistically update UI
        setIsLocalBookmarked(!isLocalBookmarked);

        try {
            await mutate(
                async () => {
                    const res = await putBookmarkByPostId(
                        token,
                        postId,
                        userId
                    );
                    if (res.status === 500) {
                        toast.error('Could not bookmark post');
                        return null;
                    }
                    return await fetchPost(postId, token, user.id);
                },
                {
                    optimisticData: (currentData) => ({
                        ...currentData,
                        isBookmarked: !currentBookmarkState,
                    }),
                    populateCache: true,
                    rollbackOnError: true,
                    revalidate: false,
                }
            );
        } catch (err) {
            // Revert state on error
            setIsLocalBookmarked(isLocalBookmarked);
            console.error('Dialog bookmark error:', err);
            toast.error('Error updating bookmark');
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="text-primary dark:text-foreground"
                >
                    <FaRegComment className="size-5.5" />
                    Comment
                </Button>
            </DialogTrigger>
            <DialogContent
                className="flex flex-col w-full h-[95vh] sm:min-w-[650px] md:min-w-[680px] mx-0 px-0 py-2"
                aria-describedby="dialog-description"
            >
                <p id="dialog-description" className="sr-only">
                    Comment section for this post
                </p>
                <DialogTitle className=" flex justify-center items-center text-xl font-bold text-primary dark:text-foreground text-center">
                    Post by {capitalizeFirstLetter(postData.author)}
                </DialogTitle>
                <ScrollArea className="flex-1 w-full overflow-y-auto min-h-[10vh]">
                    <DialogHeader></DialogHeader>
                    <Separator />

                    <div className="py-2 px-0">
                        <div className="mb-5">
                            <PostCardHeader
                                badge={postData.badge}
                                type={postData.type}
                                cardTitle={post.cardTitle}
                                identifier={post.identifier}
                                avatarSrc={postData.avatarSrc}
                                author={postData.author}
                                createdAt={postData.createdAt}
                                userId={postData.userId}
                            />
                        </div>
                        <PostCardContent
                            description={postData.description}
                            part1={part1}
                            part2={part2}
                            seeMore={seeMore}
                            setSeeMore={setSeeMore}
                            imgSrc={post.imgSrc}
                        />
                        <PostCardFooter
                            className="justify-center"
                            totalReactions={postData?.totalReactions ?? 0}
                            comments={postData?.comments ?? 0}
                            shares={postData?.shares ?? 0}
                            userReaction={postData?.currentUserReaction}
                            reactionCounts={{
                                likes: postData?.likes ?? 0,
                                dislikes: postData?.dislikes ?? 0,
                                laughs: postData?.laughs ?? 0,
                                angers: postData?.angers ?? 0,
                                totalReactions: postData?.totalReactions ?? 0,
                            }}
                            currentReactionIcon={getCurrentReactionIcon(
                                postData?.currentUserReaction,
                                {
                                    likes: postData?.likes ?? 0,
                                    dislikes: postData?.dislikes ?? 0,
                                    laughs: postData?.laughs ?? 0,
                                    angers: postData?.angers ?? 0,
                                    totalReactions:
                                        postData?.totalReactions ?? 0,
                                }
                            )}
                            handleReaction={handleDialogReaction}
                            bookmarkIcon={bookmarkIcon}
                            handleBookmark={handleDialogBookmark}
                            postId={post.postId}
                            userId={user?.id}
                            isBookmarked={postData?.isBookmarked}
                            setIsBookmarked={setIsLocalBookmarked}
                            mutatePost={mutate}
                            avatarSrc={postData.avatarSrc}
                            badge={postData.badge}
                            type={postData.type}
                            cardTitle={postData.cardTitle}
                            identifier={postData.identifier}
                            author={postData.author}
                            createdAt={postData.createdAt}
                            description={postData.description}
                            imgSrc={postData.imgSrc}
                            insideDialog={true} // Flag to prevent nested dialogs
                        />
                    </div>
                    <Separator className="ml-5 pr-5" />
                    <PostCardComments postId={post.postId} />
                </ScrollArea>
                <DialogFooter className="flex justify-start border-t-1 px-2 py-4 max-h-[50vh] overflow-hidden">
                    <PostCardCommentForm
                        postId={post.postId}
                        placeHolder={'comment'}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
