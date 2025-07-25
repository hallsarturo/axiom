'use client';

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { FaRegLaughBeam } from 'react-icons/fa';
import { FaLaughBeam } from 'react-icons/fa';
import { FaRegAngry } from 'react-icons/fa';
import { FaFaceAngry } from 'react-icons/fa6';
import { BiLike } from 'react-icons/bi';
import { BiSolidLike } from 'react-icons/bi';
import { BiSolidDislike } from 'react-icons/bi';
import { BiDislike } from 'react-icons/bi';
import { useUser } from '@/components/context/UserProfileContext';
import { useState } from 'react';

export function PostCard(props) {
    const { user } = useUser();
    const [seeMore, setSeeMore] = useState(false);
    const [like, setLike] = useState(false);
    const [dislike, setDislike] = useState(false);
    const [laugh, setLaugh] = useState(false);
    const [anger, setAnger] = useState(false);
    // Only one reaction can be active at a time
    const [activeReaction, setActiveReaction] = useState(null);

    // Conditionally render avatar according to Post Type
    let avatarSrc = null;
    if (props.type === 'post') {
        avatarSrc = user ? user.photoUrl : null;
    } else if (props.type === 'paper') {
        avatarSrc = props.magazineImg;
    } else if (props.type === 'news') {
        avatarSrc = props.agencyImg;
    }

    // Conditionally rendering Post Type Badge
    let badge;
    if (props.type === 'paper') {
        badge = 'bg-green-500';
    } else if (props.type === 'news') {
        badge = 'bg-red-400';
    } else {
        badge = 'bg-blue-500';
    }

    // Break/Hide description if longer than 250 chars
    const description = props.description;
    let part1 = description;
    let part2 = '';

    if (description.length > 250) {
        const splitIndex = description.lastIndexOf(' ', 250);
        if (splitIndex !== -1) {
            part1 = description.slice(0, splitIndex);
            part2 = description.slice(splitIndex + 1);
        } else {
            part1 = description.slice(0, 250);
            part2 = description.slice(250);
        }
    }

    // Reaction States
    const handleLikeToggle = () => {
        setActiveReaction(activeReaction === 'like' ? null : 'like');
    };
    const handleDislikeToggle = () => {
        setActiveReaction(activeReaction === 'dislike' ? null : 'dislike');
    };
    const handleLaughToggle = () => {
        setActiveReaction(activeReaction === 'laugh' ? null : 'laugh');
    };
    const handleAngerToggle = () => {
        setActiveReaction(activeReaction === 'anger' ? null : 'anger');
    };

    // Modify Trigger Reaction icon
    let currentReactionIcon;
    switch (activeReaction) {
        case 'like':
            currentReactionIcon = (
                <div className="flex flex-row gap-2 align-middle">
                    <BiSolidLike className="size-5.5" />
                    <span>{props.likes} Likes</span>
                </div>
            );
            break;
        case 'dislike':
            currentReactionIcon = (
                <div className="flex flex-row gap-2 align-middle">
                    <BiSolidDislike className="size-5.5" />
                    <span>{props.dislikes} Dislikes</span>
                </div>
            );
            break;
        case 'laugh':
            currentReactionIcon = (
                <div className="flex flex-row gap-2 align-middle">
                    <FaLaughBeam className="size-5.5" />
                    <span>{props.laughs} Laughs</span>
                </div>
            );
            break;
        case 'anger':
            currentReactionIcon = (
                <div className="flex flex-row gap-2 align-middle">
                    <FaFaceAngry className="size-5.5" />
                    <span>{props.angers} Anger</span>
                </div>
            );
            break;
        default:
            currentReactionIcon = (
                <div className="flex flex-row gap-2 align-middle">
                    <BiSolidLike className="size-5.5" />
                    <span>{props.likes}</span>
                </div>
            );
    }

    return (
        <Card className="w-2xl md:max-h-[800px] md:min-w-[680px] flex flex-col h-full">
            <CardHeader>
                <CardTitle className="leading-4 mb-2 mr-6">
                    {props.cardTitle}
                </CardTitle>
                <CardDescription className="flex flex-row items-center gap-6">
                    <Avatar>
                        <AvatarImage src={avatarSrc} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <p>{props.author}</p>
                        <p>{props.createdAt}</p>
                    </div>
                </CardDescription>
                <CardAction className="">
                    <div className="flex gap-2 items-center">
                        <div>
                            <Badge className={badge} variant="">
                                {props.type}
                            </Badge>
                        </div>
                        <div className="cursor-pointer">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                                />
                            </svg>
                        </div>
                        <div className="cursor-pointer">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18 18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                    </div>
                </CardAction>
            </CardHeader>
            <CardContent className="flex-1 max-h-[70%] overflow-hidden">
                <Collapsible
                    open={seeMore}
                    onOpenChange={setSeeMore}
                    className="text-justify mb-3"
                >
                    {description ? part1 : null}
                    <CollapsibleContent>
                        {part2 ? part2 : null}
                    </CollapsibleContent>
                    <CollapsibleTrigger className="text-blue-700 font-medium cursor-pointer ml-2">
                        {seeMore ? 'See less' : 'See more'}
                    </CollapsibleTrigger>
                </Collapsible>
                <div className="w-full flex justify-center items-center">
                    {props.imgSrc ? (
                        <Image
                            src={props.imgSrc}
                            width={500}
                            height={500}
                            alt="Picture of the author"
                            className="rounded-t-lg object-cover max-h-[600px] w-full"
                        ></Image>
                    ) : null}
                </div>
            </CardContent>
            <CardFooter className="justify-center">
                <div className="flex flex-col w-full gap-1.5">
                    <div className="flex flex-row w-full justify-between text-sm">
                        <p>Reactions {props.totalReactions}</p>
                        <p>comments {props.comments}</p>
                        <p>shares {props.shares}</p>
                    </div>
                    <Separator />
                    <div className="flex flex-row justify-around">
                        <Popover>
                            <PopoverTrigger asChild>
                                <span>
                                    <Button variant="ghost">
                                        {activeReaction ? (
                                            <div className="flex flex-row gap-2 align-middle">
                                                {currentReactionIcon}
                                            </div>
                                        ) : (
                                            <div className="flex flex-row gap-2 align-middle">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="size-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                                                    />
                                                </svg>
                                                <p>Like</p>
                                            </div>
                                        )}
                                    </Button>
                                </span>
                            </PopoverTrigger>
                            <PopoverContent className="w-full">
                                <Button
                                    onClick={handleLikeToggle}
                                    className="text-xs"
                                    variant="ghost"
                                >
                                    {activeReaction === 'like' ? (
                                        <div className="flex flex-row gap-2 align-middle">
                                            <BiSolidLike />
                                            {props.likes}
                                        </div>
                                    ) : (
                                        <div className="flex flex-row gap-2 align-middle">
                                            <BiLike />
                                            {props.likes}
                                        </div>
                                    )}{' '}
                                </Button>
                                <Button
                                    onClick={handleDislikeToggle}
                                    className="text-xs"
                                    variant="ghost"
                                >
                                    {activeReaction === 'dislike' ? (
                                        <div className="flex flex-row gap-2 align-middle">
                                            <BiSolidDislike />
                                            {props.dislikes}
                                        </div>
                                    ) : (
                                        <div className="flex flex-row gap-2 align-middle">
                                            <BiDislike />
                                            {props.dislikes}
                                        </div>
                                    )}{' '}
                                </Button>

                                <Button
                                    onClick={handleLaughToggle}
                                    className="text-xs"
                                    variant="ghost"
                                >
                                    {activeReaction === 'laugh' ? (
                                        <div className="flex flex-row gap-2 align-middle">
                                            <FaLaughBeam />
                                            {props.laughs}
                                        </div>
                                    ) : (
                                        <div className="flex flex-row gap-2 align-middle">
                                            <FaRegLaughBeam />
                                            {props.laughs}
                                        </div>
                                    )}
                                </Button>
                                <Button
                                    onClick={handleAngerToggle}
                                    className="text-xs"
                                    variant="ghost"
                                >
                                    {activeReaction === 'anger' ? (
                                        <div className="flex flex-row gap-2 align-middle">
                                            <FaFaceAngry />
                                            {props.angers}
                                        </div>
                                    ) : (
                                        <div className="flex flex-row gap-2 align-middle">
                                            <FaRegAngry />
                                            {props.angers}
                                        </div>
                                    )}
                                </Button>
                            </PopoverContent>
                        </Popover>
                        <Button variant="ghost">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                                />
                            </svg>
                            Coment
                        </Button>
                        <Button variant="ghost">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                                />
                            </svg>
                        </Button>
                        <Button variant="ghost">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                                />
                            </svg>
                            Share
                        </Button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
