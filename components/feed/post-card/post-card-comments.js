'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { getCommentsByPostId } from '@/lib/actions/actions';
import { useState, useEffect } from 'react';

export function PostCardComments({ ...props }) {
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch Comments
    useEffect(() => {
        async function fetchComments() {
            const result = await getCommentsByPostId(props.postId, page, 8);
            if (result && result.comments) {
                setComments(result.comments);
                setTotalPages(result.pagination?.totalPages || 1);
            } else {
                setComments([]);
                setTotalPages(1);
            }
        }
        fetchComments();
    }, [props.postId, page]);

    return (
        <div>
            {comments.map((comment, index) => (
                <div key={comment.id || index} className="flex w-full px-2 py-4">
                    <div className="flex gap-2 ">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <Card className="flex bg-muted m-0 mr-4 p-1">
                                <CardHeader className="m-0 px-2 pt-2">
                                    <CardTitle>{comment.userId}</CardTitle>
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
        </div>
    );
}
