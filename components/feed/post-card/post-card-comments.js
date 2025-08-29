'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCommentsByPostId } from '@/lib/actions/actions';
import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Skeleton } from '@/components/ui/skeleton';

// Create a fetcher function for SWR
const fetchComments = async (postId, page, pageSize) => {
    return await getCommentsByPostId(postId, page, pageSize);
};

export function PostCardComments({ postId, mutateKey }) {
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // Use SWR for automatic refresh
    const { data, error, isLoading, mutate } = useSWR(
        [`comments-${postId}`, page],
        () => fetchComments(postId, page, pageSize),
        {
            revalidateOnFocus: false,
            dedupingInterval: 5000,
        }
    );

    // Extract data from response
    const comments = data?.comments || [];
    const totalPages = data?.pagination?.totalPages || 1;

    if (isLoading) {
        return <CommentsSkeleton />;
    }

    if (error) {
        return <div className="text-red-500 p-4">Error loading comments</div>;
    }

    return (
        <div>
            {comments.map((comment, index) => (
                <div
                    key={comment.id || index}
                    className="flex w-full px-2 py-2"
                >
                    <div className="flex gap-2">
                        <Avatar>
                            <AvatarImage src={comment.userProfilePic} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <Card className="flex bg-muted m-0 mr-4 p-1">
                                <CardHeader className="m-0 px-2 pt-2">
                                    <Link href={`/profile/${comment.userId}`}>
                                        <CardTitle className="font-bold text-primary dark:text-primary-foreground">
                                            {comment.username}
                                        </CardTitle>
                                    </Link>
                                </CardHeader>
                                <CardContent className="mt-[-25px] py-0 px-2">
                                    {comment.content}
                                </CardContent>
                            </Card>
                            <div className="flex flex-row justify-between mr-6">
                                <div className="flex flex-row text-muted-foreground text-sm ml-4 mt-2 gap-5">
                                    <div>1 h </div>
                                    <div>Like </div>
                                    <div>Reply</div>
                                </div>
                                <div className="flex flex-row text-muted-foreground text-sm ml-4 mt-2 ">
                                    0 reactions
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* You can add pagination controls here */}
        </div>
    );
}

function CommentsSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[80px]" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}
