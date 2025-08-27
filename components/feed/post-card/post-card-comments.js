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
import { CardContent } from '@/components/ui/card';
import { FaRegComment } from 'react-icons/fa';
import { PostCardHeader } from '@/components/feed/post-card/post-card-header';

export function Comments({ post }) {
    console.log('Comments component received props:', post);
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
            <DialogContent className="max-w-2xl w-full h-[95vh] sm:min-w-[650px] md:min-w-[680px]">
                <ScrollArea className="flex-1 max-h-[70vh]">
                    <DialogTitle />
                    <DialogHeader></DialogHeader>

                    <div className="p-4">
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

                        <div className="my-4 p-4 border border-gray-100 rounded-md">
                            <p className="text-sm text-muted-foreground">
                                {post.description || 'No description available'}
                            </p>

                            {post.imgSrc && (
                                <div className="mt-4">
                                    <Image
                                        src={post.imgSrc}
                                        width={500}
                                        height={500}
                                        alt="Post image"
                                        className="rounded-md max-h-[400px] object-contain mx-auto"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <h3 className="font-medium mb-2">Comments</h3>
                            <p className="text-muted-foreground text-sm">
                                Comments feature coming soon.
                            </p>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
