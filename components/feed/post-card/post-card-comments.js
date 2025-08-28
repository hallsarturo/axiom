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
import { useState, useEffect } from 'react';

export function PostCardComments() {
    return (
        <div className="flex w-full px-2 py-4">
            <div className="flex gap-2 ">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <Card className="flex bg-muted m-0 mr-4 p-1">
                        <CardHeader className="m-0 px-2 pt-2">
                            <CardTitle>author</CardTitle>
                        </CardHeader>
                        <CardContent className="mt-[-25px] py-0 px-2">
                            <p>
                                Comment Integer congue augue in mattis
                                elementum. Aenean vulputate velit sed diam
                                blandit consequat. Vestibulum ante ipsum primis
                                in faucibus orci luctus et ultrices posuere
                                cubilia curae; Integer sit amet varius sapien,
                                ut dapibus purus.
                            </p>
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
    );
}
