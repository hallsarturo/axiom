'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Reply } from 'lucide-react';
import { PostCardCommentForm } from '@/components/feed/post-card/post-card-comment-form';
import { PostCardReactions } from '@/components/feed/post-card/post-card-reactions';
import { ChildComments } from '@/components/feed/post-card/child-comments';
import { timeAgo } from '@/lib/utils/date';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCommentsStore } from '@/lib/state/commentsStore';
import { Skeleton } from '@/components/ui/skeleton';

export function PostCardComments({ postId }) {
    const [replyCommentList, setReplyCommentList] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const pageSize = 20;

    // Get comments from Zustand store
    const { fetchComments, getComments } = useCommentsStore();
    const { comments = [], totalCount = 0 } = getComments(postId);

    // Fetch comments when component mounts or postId/page changes
    useEffect(() => {
        const loadComments = async () => {
            setLoading(true);
            await fetchComments(postId, page, pageSize);
            setLoading(false);
        };

        loadComments();
    }, [fetchComments, postId, page]);

    // Split comments into parents and children
    const parentComments = comments.filter(
        (c) => c.parentCommentId === 0 || c.parentCommentId === null
    );

    const childComments = comments.filter(
        (c) => c.parentCommentId !== 0 && c.parentCommentId !== null
    );

    // Helper: get children for a parent comment
    const getChildren = (parentId) =>
        childComments.filter((c) => c.parentCommentId === parentId);

    if (loading) {
        return <CommentsSkeleton />;
    }

    // Handle comment replies
    const handleCommentReply = (commentId) => {
        if (replyCommentList.includes(commentId)) {
            setReplyCommentList(
                replyCommentList.filter((id) => id !== commentId)
            );
        } else {
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
                                    height: 'calc(100% - 18px)', // subtract 10px from the height
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
                            <div className="flex flex-row justify-between  mr-6">
                                <div className="flex flex-row text-muted-foreground text-sm items-center ml-4 mt-0 gap-5 ">
                                    <div>{timeAgo(comment.createdAt)} </div>
                                    <div className="flex items-center">
                                        <PostCardReactions
                                            triggerIconSizeClass="size-3.5"
                                            contentIconSizeClass="size-4.5"
                                            triggerButtonVariant="link"
                                            triggerTextClass="text-muted-foreground"
                                        />{' '}
                                    </div>
                                    <div>
                                        <Button
                                            variant="link"
                                            size="xs"
                                            className="text-muted-foreground text-sm"
                                            onClick={() => {
                                                handleCommentReply(comment.id);
                                            }}
                                        >
                                            <Reply />
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
                            <>
                                <Collapsible className="relative">
                                    <span className="absolute -left-10 top-3 h-[1px] w-[30px] bg-border" />
                                    <CollapsibleTrigger className="font-medium text-primary dark:text-primary-foreground cursor-pointer">
                                        {getChildren(comment.id).length > 1
                                            ? `See the ${getChildren(comment.id).length} answers`
                                            : `See ${getChildren(comment.id).length} answer`}
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <div className="relative">
                                            <span
                                                className="absolute left-[-40px] bg-border w-px"
                                                style={{
                                                    top: '-1rem', // same as top-10
                                                    height: 'calc(90%)', // subtract 10px from the height
                                                }}
                                            />
                                            <ChildComments
                                                childComments={getChildren(
                                                    comment.id
                                                )}
                                                postId={postId}
                                                replyCommentList={
                                                    replyCommentList
                                                }
                                                handleCommentReply={
                                                    handleCommentReply
                                                }
                                            />
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            </>
                        )}

                        {replyCommentList.includes(comment.id) ? (
                            <div className="mx-3">
                                <PostCardCommentForm
                                    postId={postId}
                                    parentCommentId={comment.id}
                                    onSubmitSuccess={() => {
                                        // Close reply form after submission
                                        handleCommentReply(comment.id);
                                    }}
                                    placeHolder={`reply to ${comment.username}`}
                                />
                            </div>
                        ) : null}
                    </div>
                </div>
            ))}

            {/* Pagination controls if needed */}
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
