'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PostCardCommentForm } from '@/components/feed/post-card/post-card-comment-form';
import { timeAgo } from '@/lib/utils/date';
import Link from 'next/link';
import { useUser } from '@/components/context/UserProfileContext';
import { useState } from 'react';

export function ChildComments({ childComments }) {
    const [replyCommentList, setReplyCommentList] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 10;

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
            {childComments.map((comment, index) => (
                <div
                    key={comment.id || index}
                    className="flex flex-col w-full px-2 py-2"
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
                                    <div>{timeAgo(comment.createdAt)} </div>
                                    <div>Like </div>
                                    {/* <div>
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
                                    </div> */}
                                </div>
                                <div className="flex flex-row text-muted-foreground text-sm ml-4 mt-2 ">
                                    0 reactions
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 mx-14">
                        {}

                        {replyCommentList.includes(comment.id) ? (
                            <PostCardCommentForm
                                postId={postId}
                                parentCommentId={comment.id}
                                onSubmitSuccess={() => {
                                    // Close the reply form after successful submission
                                }}
                            />
                        ) : null}
                    </div>
                </div>
            ))}
        </div>
    );
}
