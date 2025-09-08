'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Card,
    CardContent,
    CardHeader,
    CardAction,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { Reply } from 'lucide-react';
import { PostCardCommentForm } from '@/components/feed/post-card/post-card-comment-form';
import { PostCardReactions } from '@/components/feed/post-card/post-card-reactions';
import { CommentsActions } from '@/components/feed/post-card/comments-actions';
import { ChildComments } from '@/components/feed/post-card/child-comments';
import { timeAgo } from '@/lib/utils/date';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCommentsStore } from '@/lib/state/commentsStore';
import { Skeleton } from '@/components/ui/skeleton';
import { genInitials } from '@/lib/utils/strings';

export function PostCardComments({ postId, userId }) {
    const [replyCommentList, setReplyCommentList] = useState([]);
    const [expandedComments, setExpandedComments] = useState([]);
    const [parentPage, setParentPage] = useState(1);
    const pageSize = 20;

    // Get comments from Zustand store
    const {
        fetchParentComments,
        fetchChildComments,
        getParentComments,
        getChildComments,
        areChildCommentsLoaded,
        isLoadingChildComments,
    } = useCommentsStore();

    // Get parent comments data
    const {
        comments: parentComments,
        totalCount,
        isLoading,
    } = getParentComments(postId);

    // Fetch parent comments when component mounts or postId/page changes
    useEffect(() => {
        const loadParents = async () => {
            await fetchParentComments(postId, parentPage, pageSize, userId);
        };
        loadParents();
    }, [fetchParentComments, postId, parentPage, userId]);

    // Handle comment replies toggle
    const handleCommentReply = (commentId) => {
        setReplyCommentList((prev) =>
            prev.includes(commentId)
                ? prev.filter((id) => id !== commentId)
                : [...prev, commentId]
        );
    };

    // Handle click on "See answers"
    const handleExpandChildren = async (commentId) => {
        // Toggle expanded state
        const isCurrentlyExpanded = expandedComments.includes(commentId);

        if (isCurrentlyExpanded) {
            setExpandedComments((prev) =>
                prev.filter((id) => id !== commentId)
            );
        } else {
            setExpandedComments((prev) => [...prev, commentId]);

            // Only fetch if not already loaded
            if (!areChildCommentsLoaded(postId, commentId)) {
                await fetchChildComments(postId, commentId, 1, 20, userId);
            }
        }
    };

    if (isLoading) {
        return <CommentsSkeleton />;
    }

    return (
        <div className="mt-3">
            {parentComments.map((comment, index) => (
                <div
                    key={comment.id || index}
                    className="flex flex-col w-full px-2 pb-1"
                >
                    <div className="flex gap-2 relative">
                        <Avatar className="">
                            <AvatarImage src={comment.userProfilePic} />
                            <AvatarFallback>
                                {genInitials(comment.username)}
                            </AvatarFallback>
                        </Avatar>
                        {comment.childrenCount > 0 && (
                            <span
                                className="absolute left-4 bg-border w-px"
                                style={{
                                    top: '2.5rem',
                                    height: 'calc(100% - 18px)',
                                }}
                            />
                        )}
                        <div className="flex flex-col">
                            <Card className="flex bg-muted m-0 mr-4 p-1 pb-2">
                                <CardHeader className="m-0 px-2 pt-2">
                                    <CardTitle className="font-bold text-primary dark:text-primary-foreground">
                                        <Link
                                            href={`/profile/${comment.userId}`}
                                        >
                                            {comment.username}
                                        </Link>
                                    </CardTitle>
                                    <CardAction className="pr-4">
                                        <div className="flex">
                                            <CommentsActions
                                                commentId={comment.id}
                                                postId={postId}
                                                userId={userId}
                                                parentPage={parentPage}
                                                pageSize={pageSize}
                                            />
                                        </div>
                                    </CardAction>
                                </CardHeader>
                                <CardContent className="mt-[-25px] py-0 px-2">
                                    {comment.content}
                                </CardContent>
                            </Card>
                            <div className="flex flex-row justify-between mr-6">
                                <div className="flex flex-row text-muted-foreground text-sm items-center ml-4 mt-0 gap-5">
                                    <div>{timeAgo(comment.createdAt)}</div>
                                    <div className="flex items-center">
                                        <PostCardReactions
                                            postId={postId}
                                            commentId={comment.id}
                                            type="comment"
                                            triggerIconSizeClass="size-3.5"
                                            contentIconSizeClass="size-4.5"
                                            triggerButtonVariant="link"
                                            triggerTextClass="text-muted-foreground"
                                            hover="disabled"
                                        />
                                    </div>
                                    <div>
                                        <Button
                                            variant="link"
                                            size="xs"
                                            className="text-muted-foreground text-sm"
                                            onClick={() =>
                                                handleCommentReply(comment.id)
                                            }
                                        >
                                            <Reply />
                                            Reply
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex flex-row text-muted-foreground text-sm ml-4 mt-2">
                                    {comment.totalReactions || 0} reactions
                                </div>
                            </div>
                        </div>
                    </div>
                                   {/* Show reply form if comment is in replyCommentList */}
                        {replyCommentList.includes(comment.id) && (
                            <div className="ml-6 mr-12 mb-2">
                                <PostCardCommentForm
                                    postId={postId}
                                    parentCommentId={comment.id}
                                    onSubmitSuccess={() => {
                                        handleCommentReply(comment.id);
                                        // If this comment already had the child comments expanded,
                                        // refresh them after replying
                                        if (
                                            expandedComments.includes(
                                                comment.id
                                            )
                                        ) {
                                            fetchChildComments(
                                                postId,
                                                comment.id,
                                                1,
                                                20
                                            );
                                        }
                                    }}
                                    placeHolder={`Reply to ${comment.username}`}
                                />
                            </div>
                        )}
                    <div className="mt-0 mx-14 relative">
                        {/* Show "See answers" button if comment has children */}
                        {comment.hasChildren && comment.childrenCount > 0 && (
                            <Collapsible
                                className="relative mb-1"
                                open={expandedComments.includes(comment.id)}
                                onOpenChange={() =>
                                    handleExpandChildren(comment.id)
                                }
                            >
                                <span className="absolute -left-10 top-3 h-[1px] w-[30px] bg-border" />
                                <CollapsibleTrigger className="font-medium text-primary dark:text-primary-foreground cursor-pointer mb-0">
                                    {comment.childrenCount > 1
                                        ? `See the ${comment.childrenCount} answers`
                                        : `See ${comment.childrenCount} answer`}
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-2">
                                    <div className="relative">
                                        <span
                                            className="absolute left-[-40px] bg-border w-px"
                                            style={{
                                                top: '-1rem',
                                                height: 'calc(90%)',
                                            }}
                                        />
                                        {isLoadingChildComments(
                                            postId,
                                            comment.id
                                        ) ? (
                                            <div className="p-2">
                                                <Skeleton className="h-10 w-full rounded mb-2" />
                                                <Skeleton className="h-8 w-3/4 rounded" />
                                            </div>
                                        ) : (
                                            <ChildComments
                                                childComments={
                                                    getChildComments(
                                                        postId,
                                                        comment.id
                                                    ).comments
                                                }
                                                postId={postId}
                                                replyCommentList={
                                                    replyCommentList
                                                }
                                                handleCommentReply={
                                                    handleCommentReply
                                                }
                                            />
                                        )}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        )}

         
                    </div>
                </div>
            ))}

            {/* Pagination controls if needed */}
            {totalCount > pageSize && (
                <div className="flex justify-center mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={parentPage === 1}
                        onClick={() => setParentPage((p) => Math.max(1, p - 1))}
                    >
                        Previous
                    </Button>
                    <span className="mx-2 flex items-center">
                        Page {parentPage} of {Math.ceil(totalCount / pageSize)}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={
                            parentPage >= Math.ceil(totalCount / pageSize)
                        }
                        onClick={() => setParentPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
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
