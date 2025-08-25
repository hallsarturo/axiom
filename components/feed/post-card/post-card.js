'use client';

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { FaLaughBeam } from 'react-icons/fa';
import { FaFaceAngry } from 'react-icons/fa6';
import { BiLike, BiSolidLike, BiSolidDislike } from 'react-icons/bi';
import { PostCardReactions } from '@/components/feed/post-card/post-card-reactions';
import { PostCardHeader } from '@/components/feed/post-card/post-card-header';
import { Comments } from '@/components/feed/post-card/post-card-comments';
import { useUser } from '@/components/context/UserProfileContext';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { putReaction, deleteUserPost } from '@/lib/actions/actions';
import { normalizeImageUrl } from '@/lib/utils/image';
import { formatDate } from '@/lib/utils/date';

const fetchPost = async (postId, token, userId) => {
    if (!postId) throw new Error('No postId provided');
    const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`
    );

    // Add userId as query parameter for development
    if (process.env.NODE_ENV === 'development' && userId) {
        console.log('fetchPost userId: ', userId);
        url.searchParams.append('userId', String(userId));
    }

    const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch: ${res.status} ${text}`);
    }
    return res.json();
};

export function PostCard(props) {
    const { user } = useUser();
    const [seeMore, setSeeMore] = useState(false);
    // Only one reaction can be active at a time
    const [activeReaction, setActiveReaction] = useState(null);

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
            console.log('currentUserReaction', data.currentUserReaction);
            setActiveReaction(data.currentUserReaction);
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

    // Conditionally render avatar according to Post Type
    let avatarSrc = null;
    if (props.type === 'user') {
        avatarSrc = normalizeImageUrl(props.avatarPic);
    } else if (props.type === 'paper') {
        avatarSrc = normalizeImageUrl(props.magazineImg);
    } else if (props.type === 'news') {
        avatarSrc = normalizeImageUrl(props.agencyImg);
    }

    // Conditionally rendering Post Type Badge
    let badge;
    if (props.type === 'paper') {
        badge = 'bg-green-500';
    } else if (props.type === 'news') {
        badge = 'bg-red-400';
    } else {
        badge = 'bg-blue-500';
    }

    // Break/Hide description if longer than 250 chars
    const description = props.description;
    let part1 = description;
    let part2 = '';

    if (description && description.length > 250) {
        const splitIndex = description.lastIndexOf(' ', 250);
        if (splitIndex !== -1) {
            part1 = description.slice(0, splitIndex);
            part2 = description.slice(splitIndex + 1);
        } else {
            part1 = description.slice(0, 250);
            part2 = description.slice(250);
        }
    }

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

    // Use SWR data for user's reaction
    const userReaction = data?.currentUserReaction;

    // Modify Trigger Reaction icon
    let currentReactionIcon;
    switch (userReaction) {
        case 'like':
            currentReactionIcon = (
                <div className="flex flex-row gap-2 align-middle">
                    <BiSolidLike className="size-5.5 text-primary dark:text-foreground" />
                    <span>{reactionCounts.likes} Likes</span>
                </div>
            );
            break;
        case 'dislike':
            currentReactionIcon = (
                <div className="flex flex-row gap-2 align-middle text-primary dark:text-foreground">
                    <BiSolidDislike className="size-5.5" />
                    <span>{reactionCounts.dislikes} Dislikes</span>
                </div>
            );
            break;
        case 'laugh':
            currentReactionIcon = (
                <div className="flex flex-row gap-2 align-middle text-primary dark:text-foreground">
                    <FaLaughBeam className="size-5.5" />
                    <span>{reactionCounts.laughs} Laughs</span>
                </div>
            );
            break;
        case 'anger':
            currentReactionIcon = (
                <div className="flex flex-row gap-2 align-middle text-primary dark:text-foreground">
                    <FaFaceAngry className="size-5.5" />
                    <span>{reactionCounts.angers} Anger</span>
                </div>
            );
            break;
        default:
            currentReactionIcon = (
                <div className="flex flex-row gap-2 align-middle">
                    <BiLike className="size-5.5" />
                    <span>{reactionCounts.likes} Likes</span>
                </div>
            );
    }

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
                    className="relative"
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
                <CardFooter className="justify-center">
                    <div className="flex flex-col w-full gap-1.5">
                        <div className="flex flex-row w-full justify-between text-sm  flex-wrap">
                            <p>reactions {totalReactions}</p>
                            <p>comments {props.comments}</p>
                            <p>shares {props.shares}</p>
                        </div>
                        <Separator />
                        <div className="flex flex-row justify-around flex-wrap">
                            <PostCardReactions
                                userReaction={userReaction}
                                reactionCounts={reactionCounts}
                                currentReactionIcon={currentReactionIcon}
                                handleReaction={handleReaction}
                            />

                            <Button
                                variant="ghost"
                                className="text-primary dark:text-foreground"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6 text-primary dark:text-foreground"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                                    />
                                </svg>
                                Coment
                            </Button>
                            <Button
                                variant="ghost"
                                className="text-primary dark:text-foreground"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6 text-primary dark:text-foreground"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                                    />
                                </svg>
                            </Button>
                            <Button
                                variant="ghost"
                                className="text-primary dark:text-foreground flex-shrink-0"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6 text-primary dark:text-foreground"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                                    />
                                </svg>
                                Share
                            </Button>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
