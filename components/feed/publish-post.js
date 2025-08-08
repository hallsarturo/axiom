'use client';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useUser } from '@/components/context/UserProfileContext';
import { useState } from 'react';

export function PublishPost(props) {
    const { user } = useUser();
    const [disabledInput, setDisabledInput] = useState(false);
    return (
        <div className={`w-full ${props.className || ''}`}>
            <Card className=" max-w-[700px] m-4 p-8">
                <div className="">
                    <div className="flex flex-row gap-4 mb-3 items-center sm:items-start">
                        <Avatar>
                            <AvatarImage
                                src={user ? user.photoUrl : null}
                            ></AvatarImage>
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex w-full">
                            <Input
                                placeholder="Share something thoughtful"
                                onClick={() => setDisabledInput(!disabledInput)}
                                disabled={disabledInput}
                                className="w-full text-sm sm:text-base"
                            />
                        </div>
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-3 mt-3 sm:flex-row items-center sm:justify-around">
                        <Button
                            variant="secondary"
                            className="text-xs px-3 py-1 h-8 flex items-center justify-center w-fit"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6 mr-2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                />
                            </svg>
                            <span className="">upload an image</span>
                        </Button>
                        <Button
                            variant="secondary"
                            className="text-xs py-1 h-8 flex items-center justify-center w-fit"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6 mr-2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
                                />
                            </svg>
                            <span className="">publish a paper</span>
                        </Button>
                        <Button className="w-fit sm:w-auto mt-2 sm:mt-0">
                            Publish
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
