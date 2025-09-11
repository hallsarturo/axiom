import {
    CardHeader,
    CardAction,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/date';
import { genInitials } from '@/lib/utils/strings';
import { normalizeImageUrl } from '@/lib/utils/image';

export function PostCardHeader({
    badge,
    type,
    cardTitle,
    identifier,
    avatarSrc,
    author,
    createdAt,
    userId,
    onDelete,
}) {
    // compute href and choose tag based on type
    const href = identifier ? `https://${identifier}` : '#';
    const useAnchor = type === 'paper' || type === 'news';

    return (
        <CardHeader className="mt-[-20px] sm:mt-[-10px]">
            <div className="flex flex-col w-full">
                <div className="flex mb-4">
                    <CardDescription className="flex flex-row items-center gap-6 w-full mt-2">
                        <Avatar>
                            {/* Clearer debugging to isolate the issue */}
                            <AvatarImage
                                src={avatarSrc}
                                alt={`${author}'s avatar`}
                            />
                            <AvatarFallback>
                                {genInitials(author)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium text-primary dark:text-foreground">
                                {type === 'user' ? (
                                    <Link href={`/profile/${userId}`}>
                                        {author}
                                    </Link>
                                ) : (
                                    author
                                )}
                            </p>
                            <p>{formatDate(createdAt)}</p>
                        </div>
                    </CardDescription>
                    {/* CardAction as a row for screens < 455px */}
                    {/* <div className="flex gap-2 items-center justify-end flex-row min-[455px]:hidden mt-[-4px] mb-4 w-full">
                        <Badge className={badge} variant="">
                            {type}
                        </Badge> */}
                    {/* ...other icons/buttons... */}
                    {/* </div> */}

                    {/* Custom CardAction for screens >= 455px */}
                    <div className="flex flex-col sm:flex-row justify-end pt-[5px] sm:mt-[0px] mb-2">
                        <div className="flex flex-col sm:flex-row gap-0 sm:items-start items-center sm:justify-end justify-center w-full">
                            <div className="sm:mr-1 mr-0">
                                <Badge className={badge} variant="">
                                    {type}
                                </Badge>
                            </div>
                            <div className="flex">
                                <Button variant="ghost" size="sm">
                                    <div className="cursor-pointer flex-shrink-0">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="size-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                                            />
                                        </svg>
                                    </div>
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="cursor-pointer"
                                            size="sm"
                                        >
                                            <div className=" flex-shrink-0">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="size-5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6 18 18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </div>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Delete Post. Are you sure?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                               Deleting a post will also remove its comments. This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={onDelete}
                                            >
                                                Continue
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </div>
                </div>
                <CardTitle className="leading-5 mt-1 -mb-4 w-full">
                    {useAnchor ? (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {cardTitle}
                        </a>
                    ) : (
                        <Link
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {cardTitle}
                        </Link>
                    )}
                </CardTitle>
            </div>
        </CardHeader>
    );
}
