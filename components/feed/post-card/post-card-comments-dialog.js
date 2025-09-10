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
import { useCommentsStore } from '@/lib/state/commentsStore';
import { useState, useEffect } from 'react';
import { useUser } from '@/components/context/UserProfileContext';
import { putReaction, putBookmarkByPostId } from '@/lib/actions/actions';
import { toast } from 'sonner';
import { useReactionsStore } from '@/lib/state/reactionsStore';
import { useBookmarksStore } from '@/lib/state/bookmarksStore';
import { getAvatarSrc } from '@/lib/utils/post-card';
import { normalizeImageUrl } from '@/lib/utils/image';

export function PostCardCommentsDialog({
    post,
    commentDialogOpen,
    setCommentDialogOpen,
}) {
    const { user } = useUser();
    const token =
        process.env.NODE_ENV === 'development'
            ? typeof window !== 'undefined'
                ? localStorage.getItem('token')
                : null
            : null;

    // Get reactions functions from store
    const { setReactionData, getReactionData } = useReactionsStore();

    // Get bookmarks functions from store
    const { setBookmarkData, fetchBookmarkCount, getBookmarkData } =
        useBookmarksStore();

    // Fetch live post data
    const { data, mutate } = useSWR(
        post.postId && token && user?.id
            ? [`post`, post.postId, token, user.id]
            : null,
        ([, postId, token, userId]) => fetchPost(postId, token, userId),
        {
            onSuccess: (data) => {
                // Sync with stores
                if (data) {
                    setReactionData(post.postId, data);
                    // Also set bookmark data
                    setBookmarkData(post.postId, {
                        isBookmarked: data.isBookmarked,
                        bookmarkCount: data.bookmarkCount || 0,
                    });
                }
            },
        }
    );

    // Always fetch bookmark count when component mounts or post ID changes
    useEffect(() => {
        if (post.postId) {
            fetchBookmarkCount(post.postId);
        }
    }, [post.postId, fetchBookmarkCount]);

    // Get bookmark data from store
    const { bookmarkCount, isBookmarked } = getBookmarkData(post.postId);

    // Use SWR data if available, else fallback to passed post
    const postData = data || post;

    // Calculate avatarSrc using the same logic as in PostCard
    const avatarSrc = getAvatarSrc(
        postData.type,
        postData.avatarPic || post.avatarPic,
        postData.magazineImg || post.magazineImg,
        postData.agencyImg || post.agencyImg,
        normalizeImageUrl
    );

    // Get reaction data AFTER we have postData:
    const reactionData = getReactionData(post.postId);
    // This ensures we have the latest data from the store
    const totalReactions =
        reactionData?.reactionCounts?.totalReactions ||
        postData?.totalReactions ||
        0;

    // Get comment count from Zustand store
    const { getComments } = useCommentsStore();
    const storeComments = getComments(post.postId);

    // Use comment count from Zustand store if available, otherwise use SWR data
    const commentsCount = storeComments.totalCount || postData?.comments || 0;

    const [seeMore, setSeeMore] = useState(false);

    // Split description for "See More" functionality
    const description = postData.description;
    const [part1, part2] = splitDescription(description);

    return (
        <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
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
                <DialogTitle className="flex justify-center items-center text-xl font-bold text-primary dark:text-foreground text-center">
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
                                avatarSrc={avatarSrc} 
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
                            totalReactions={totalReactions}
                            comments={commentsCount}
                            shares={postData?.shares ?? 0}
                            postId={post.postId}
                            userId={user?.id}
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
                    <PostCardComments postId={post.postId} userId={user?.id} />
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
