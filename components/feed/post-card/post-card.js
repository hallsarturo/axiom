'use client';

import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { PostCardHeader } from '@/components/feed/post-card/post-card-header';
import { PostCardContent } from '@/components/feed/post-card/post-card-content';
import { PostCardFooter } from '@/components/feed/post-card/post-card-footer';
import { useCommentsStore } from '@/lib/state/commentsStore';
import { useUser } from '@/components/context/UserProfileContext';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { putReaction, deleteUserPost } from '@/lib/actions/actions';
import { normalizeImageUrl } from '@/lib/utils/image';
import {
    getAvatarSrc,
    getBadgeColor,
    splitDescription,
    getCurrentReactionIcon,
    fetchPost,
} from '@/lib/utils/post-card';
import { useReactionsStore } from '@/lib/state/reactionsStore';
import { useBookmarksStore } from '@/lib/state/bookmarksStore';

export function PostCard(props) {
    const { user } = useUser();
    const [seeMore, setSeeMore] = useState(false);

    // Get the reaction store functions
    const {
        setReactionData,
        handleReaction: handleStoreReaction,
        getReactionData,
    } = useReactionsStore();

    // Get the bookmarks store functions
    const { setBookmarkData, fetchBookmarkCount } = useBookmarksStore();

    const token =
        process.env.NODE_ENV === 'development'
            ? typeof window !== 'undefined'
                ? localStorage.getItem('token')
                : null
            : null;

    // Fetch data with SWR
    const { data, mutate } = useSWR(
        props.postId && token && user?.id
            ? [`post`, props.postId, token, user.id]
            : null,
        ([, postId, token, userId]) => fetchPost(postId, token, userId),
        {
            onSuccess: (data) => {
                if (data) {
                    // Set reaction data
                    setReactionData(props.postId, data);

                    // Set bookmark data from post response
                    setBookmarkData(props.postId, {
                        isBookmarked: data.isBookmarked,
                        // Don't set bookmarkCount here as it might not be accurate
                    });
                }
            },
        }
    );

    // Always fetch bookmark count when component mounts or post ID changes
    useEffect(() => {
        if (props.postId) {
            fetchBookmarkCount(props.postId);
        }
    }, [props.postId, fetchBookmarkCount]);

    // Get reaction data from store
    const { userReaction, reactionCounts } = getReactionData(props.postId);

    // Generate the current reaction icon based on store data
    const currentReactionIcon = getCurrentReactionIcon(
        userReaction,
        reactionCounts
    );

    // Reaction handler delegates to store
    const handleReaction = async (type) => {
        await handleStoreReaction(props.postId, type, user?.id, token);
        // We don't need to mutate SWR here as the store handles the network calls
        // If you want to keep SWR in sync, you could still call mutate()
        mutate();
    };

    // Get comment count from Zustand store
    const { getComments } = useCommentsStore();
    const storeComments = getComments(props.postId);
    const commentsCount =
        storeComments.totalCount || data?.commentsCount || props.commentsCount;

    // Get avatar src, badge color, etc.
    const avatarSrc = getAvatarSrc(
        props.type,
        props.avatarPic,
        props.magazineImg,
        props.agencyImg,
        normalizeImageUrl
    );
    const badge = getBadgeColor(props.type);
    const description = props.description;
    const [part1, part2] = splitDescription(description);

    // Delete user post
    async function deletePost() {
        let token = null;
        if (
            process.env.NODE_ENV === 'development' &&
            typeof window !== 'undefined'
        ) {
            token = localStorage.getItem('token');
        }

        try {
            const result = await deleteUserPost(token, props.postId);
            if (result.success) {
                toast.success('Post deleted!');
                // Call parent feed refresh if available
                if (props.mutateFeed) {
                    props.mutateFeed();
                }
            } else {
                // Show backend error if available
                const errorMsg =
                    result.error || 'Failed to delete post. Please try again.';
                toast.error(errorMsg);
            }
        } catch (err) {
            toast.err('something happened...');
            console.error('deletePost err: ', err);
        }
    }

    // Use total reactions from store
    const totalReactions = reactionCounts.totalReactions;

    return (
        <div
            className={`flex w-full justify-center mb-4 px-4 ${props.className ?? ''}`}
        >
            <Card className="max-w-2xl w-full md:max-h-[800px] sm:min-w-[650px] md:min-w-[680px] flex flex-col h-full">
                <PostCardHeader
                    className=""
                    badge={badge}
                    type={props.type}
                    cardTitle={props.cardTitle}
                    identifier={props.identifier}
                    avatarSrc={avatarSrc}
                    author={props.author}
                    createdAt={props.createdAt}
                    userId={props.userId}
                    onDelete={deletePost}
                />
                <ScrollArea className="flex-1 max-h-[800px] overflow-y-auto rounded-lg">
                    <PostCardContent
                        description={description}
                        part1={part1}
                        part2={part2}
                        seeMore={seeMore}
                        setSeeMore={setSeeMore}
                        imgSrc={props.imgSrc}
                    />
                </ScrollArea>
                <PostCardFooter
                    className="justify-center"
                    totalReactions={totalReactions}
                    comments={commentsCount}
                    shares={props.shares}
                    userReaction={userReaction}
                    reactionCounts={reactionCounts}
                    currentReactionIcon={currentReactionIcon}
                    handleReaction={handleReaction}
                    postId={props.postId}
                    userId={user?.id}
                    mutatePost={mutate}
                    avatarSrc={avatarSrc}
                    badge={badge}
                    type={props.type}
                    cardTitle={props.cardTitle}
                    identifier={props.identifier}
                    author={props.author}
                    createdAt={props.createdAt}
                    description={props.description}
                    imgSrc={props.imgSrc}
                />
            </Card>
        </div>
    );
}
