'use client';

import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import {
    splitDescription,
    getCurrentReactionIcon,
} from '@/lib/utils/post-card';
import { capitalizeFirstLetter } from '@/lib/utils/strings';
import useSWR from 'swr';
import { fetchPost } from '@/lib/utils/post-card';
import { useState } from 'react';
import { useUser } from '@/components/context/UserProfileContext';

export function Comments({ post }) {
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

    //console.log('Comments component received props:', post);
    const [seeMore, setSeeMore] = useState(false);
    const [part1, part2] = splitDescription(post.description);

    // Use SWR data if available, else fallback to passed post
    const postData = data || post;

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
            <DialogContent className="flex flex-col w-full h-[95vh] sm:min-w-[650px] md:min-w-[680px] mx-0 px-0">
                <ScrollArea className="flex-1 w-full overflow-y-auto">
                    <DialogTitle className="flex justify-center text-xl font-bold text-primary dark:text-foreground text-center mb-2">
                        Post by {capitalizeFirstLetter(post.author)}
                    </DialogTitle>
                    <DialogHeader></DialogHeader>
                    <Separator />

                    <div className="py-2">
                        <PostCardHeader
                            badge={post.badge}
                            type={post.type}
                            cardTitle={post.cardTitle}
                            identifier={post.identifier}
                            avatarSrc={post.avatarSrc}
                            author={post.author}
                            createdAt={post.createdAt}
                            userId={post.userId}
                        />
                        <PostCardContent
                            description={post.description}
                            part1={part1}
                            part2={part2}
                            seeMore={seeMore}
                            setSeeMore={setSeeMore}
                            imgSrc={post.imgSrc}
                        />
                        <PostCardFooter
                            className="justify-center"
                            totalReactions={post.totalReactions ?? 0}
                            comments={post.comments ?? 0}
                            shares={post.shares ?? 0}
                            userReaction={post.userReaction}
                            reactionCounts={
                                post.reactionCounts ?? {
                                    likes: 0,
                                    dislikes: 0,
                                    laughs: 0,
                                    angers: 0,
                                    totalReactions: 0,
                                }
                            }
                            currentReactionIcon={post.currentReactionIcon}
                            handleReaction={post.handleReaction}
                            postId={post.postId}
                            userId={post.userId}
                            isBookmarked={post.isBookmarked ?? false}
                            setIsBookmarked={post.setIsBookmarked}
                            mutatePost={post.mutatePost}
                            avatarSrc={post.avatarSrc}
                            badge={post.badge}
                            type={post.type}
                            cardTitle={post.cardTitle}
                            identifier={post.identifier}
                            author={post.author}
                            createdAt={post.createdAt}
                            description={post.description}
                            imgSrc={post.imgSrc}
                        />
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
