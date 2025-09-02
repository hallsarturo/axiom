'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { PostCardCommentForm } from '@/components/feed/post-card/post-card-comment-form';
import { ChildComments } from '@/components/feed/post-card/child-comments';
import { getCommentsByPostId } from '@/lib/actions/actions';
import { timeAgo } from '@/lib/utils/date';
import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Skeleton } from '@/components/ui/skeleton';

// Create a fetcher function for SWR
const fetchComments = async (postId, page, pageSize) => {
    return await getCommentsByPostId(postId, page, pageSize);
};

export function PostCardComments({ postId, mutateKey }) {
    const [replyCommentList, setReplyCommentList] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 20;

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

    // Split comments into parents and children
    const parentComments = comments.filter(
        (c) => c.parentCommentId === 0 || c.parentCommentId === null
    );
    console.log('parent comments: ', parentComments);
    const childComments = comments.filter(
        (c) => c.parentCommentId !== 0 && c.parentCommentId !== null
    );
    console.log('childComments: ', childComments);

    // Helper: get children for a parent comment
    const getChildren = (parentId) =>
        childComments.filter((c) => c.parentCommentId === parentId);

    if (isLoading) {
        return <CommentsSkeleton />;
    }

    if (error) {
        return <div className="text-red-500 p-4">Error loading comments</div>;
    }

    // Handle comment replies
    const handleCommentReply = (commentId) => {
        // Toggle the comment ID in the replyCommentList
        if (replyCommentList.includes(commentId)) {
            //Remove the ID if already in the List (closes the reply form)
            setReplyCommentList(
                replyCommentList.filter((id) => id !== commentId)
            );
        } else {
            // Add the ID if not in the list (opens the reply form)
            setReplyCommentList([...replyCommentList, commentId]);
        }
    };

    return (
        <div>
            {parentComments.map((comment, index) => (
                <div
                    key={comment.id || index}
                    className="flex flex-col w-full px-2 py-2"
                >
                    <div className="flex gap-2 relative">
                        <Avatar className="">
                            <AvatarImage src={comment.userProfilePic} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        {getChildren(comment.id).length > 0 && (
                            <span
                                className="absolute left-4 bg-border w-px"
                                style={{
                                    top: '2.5rem', // same as top-10
                                    height: 'calc(100% - 4px)', // subtract 10px from the height
                                }}
                            />
                        )}
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
                                    <div>{timeAgo(comment.createdAt)} </div>
                                    <div>Like </div>
                                    <div>
                                        <Button
                                            variant="link"
                                            size="xs"
                                            className="text-muted-foreground text-sm"
                                            onClick={() => {
                                                handleCommentReply(comment.id);
                                            }}
                                        >
                                            Reply
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex flex-row text-muted-foreground text-sm ml-4 mt-2 ">
                                    0 reactions
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 mx-14 relative">
                        {/* Render child comments for this parent */}
                        {getChildren(comment.id).length > 0 && (
                            <ChildComments
                                childComments={getChildren(comment.id)}
                                postId={postId}
                                replyCommentList={replyCommentList}
                                handleCommentReply={handleCommentReply}
                            />
                        )}

                        {replyCommentList.includes(comment.id) ? (
                            <div className="mx-3">
                                <PostCardCommentForm
                                    postId={postId}
                                    parentCommentId={comment.id}
                                    onSubmitSuccess={() => {
                                        // Close the reply form after successful submission
                                        handleCommentReply(comment.id); // Toggle off the reply form
                                        mutate(); // Re-fetch comments to show the new reply
                                    }}
                                    placeHolder={`reply to ${comment.username}`}
                                />
                            </div>
                        ) : null}
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
