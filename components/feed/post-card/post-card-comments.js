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
import { Separator } from '@/components/ui/separator';
import { CardContent } from '@/components/ui/card';
import { PostCardHeader } from '@/components/feed/post-card/post-card-header';
import { PostCardContent } from '@/components/feed/post-card/post-card-content';
import { splitDescription } from '@/lib/utils/post-card';
import { capitalizeFirstLetter } from '@/lib/utils/strings';
import { useState } from 'react';

export function Comments({ post }) {
    //console.log('Comments component received props:', post);
    const [seeMore, setSeeMore] = useState(false);
    const [part1, part2] = splitDescription(post.description);

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
                        Publicación de {capitalizeFirstLetter(post.author)}
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
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
