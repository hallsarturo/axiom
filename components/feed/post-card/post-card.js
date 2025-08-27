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
import { PostCardFooter } from '@/components/feed/post-card/post-card-footer';
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

export function PostCard(props) {
    const { user } = useUser();
    const [seeMore, setSeeMore] = useState(false);
    // Only one reaction can be active at a time
    const [activeReaction, setActiveReaction] = useState(null);
    const [isLocalBookmarked, setIsLocalBookmarked] = useState(
        props.isBookmarked || false
    );

    const token =
        process.env.NODE_ENV === 'development'
            ? typeof window !== 'undefined'
                ? localStorage.getItem('token')
                : null
            : null;
    const { data, mutate } = useSWR(
        props.postId && token && user?.id
            ? [`post`, props.postId, token, user.id]
            : null,
        ([, postId, token, userId]) => fetchPost(postId, token, userId)
    );

    // Set activeReaction from backend data when data changes
    useEffect(() => {
        if (data && data.currentUserReaction !== undefined) {
            //console.log('currentUserReaction', data.currentUserReaction);
            setActiveReaction(data.currentUserReaction);
        }
    }, [data]);

    // Set activeBookmarked from backend data when data changes
    useEffect(() => {
        if (data && data.isBookmarked !== undefined) {
            //console.log('currentUserReaction', data.currentUserReaction);
            setIsLocalBookmarked(data.isBookmarked);
        }
    }, [data]);

    // Use SWR data for reaction counts
    const reactionCounts = data
        ? {
              likes: data.likes,
              dislikes: data.dislikes,
              laughs: data.laughs,
              angers: data.angers,
              totalReactions: data.totalReactions,
          }
        : {
              likes: props.likes,
              dislikes: props.dislikes,
              laughs: props.laughs,
              angers: props.angers,
              totalReactions: props.totalReactions,
          };

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
    // Use SWR data for user's reaction
    const userReaction = data?.currentUserReaction;
    const currentReactionIcon = getCurrentReactionIcon(
        userReaction,
        reactionCounts
    );

    // Reaction States
    const handleReaction = async (type) => {
        try {
            await mutate(
                async () => {
                    console.log('reaction handler clicked');
                    await putReaction(token, user.id, props.postId, type);
                    return await fetchPost(props.postId, token, user.id);
                },
                { revalidate: true }
            );
        } catch (err) {
            console.error('Reaction error:', err);
        }
    };

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

    // Use SWR data for total reactions
    const totalReactions = data?.totalReactions ?? props.totalReactions;

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
                    <CardContent>
                        <Collapsible
                            open={seeMore}
                            onOpenChange={setSeeMore}
                            className="text-justify mb-3"
                        >
                            {description ? part1 : null}
                            <CollapsibleContent>
                                {part2 ? part2 : null}
                            </CollapsibleContent>
                            <CollapsibleTrigger className="text-primary dark:text-foreground font-medium cursor-pointer ml-2">
                                {seeMore ? 'See less' : 'See more'}
                            </CollapsibleTrigger>
                        </Collapsible>
                        <div className="w-full flex justify-center items-center">
                            {/* {console.log('props.imgSrc: ', props.imgSrc)} */}
                            {props.imgSrc ? (
                                <Image
                                    src={props.imgSrc}
                                    width={500}
                                    height={500}
                                    alt="Picture of the author"
                                    className="rounded-t-lg object-cover max-h-[600px] w-full"
                                ></Image>
                            ) : null}
                        </div>
                    </CardContent>
                </ScrollArea>
                <PostCardFooter
                    className="justify-center"
                    totalReactions={totalReactions}
                    comments={props.comments}
                    shares={props.shares}
                    userReaction={userReaction}
                    reactionCounts={reactionCounts}
                    currentReactionIcon={currentReactionIcon}
                    handleReaction={handleReaction}
                    postId={props.postId}
                    userId={user?.id}
                    isBookmarked={isLocalBookmarked}
                    setIsBookmarked={setIsLocalBookmarked}
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
