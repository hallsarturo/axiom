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
import Link from 'next/link';
import { formatDate } from '@/lib/utils/date';

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
    return (
        <CardHeader className="relative">
            <div className="flex flex-col w-full">
                {/* CardAction as a row for screens < 455px */}
                <div className="flex gap-2 items-center justify-end flex-row min-[455px]:hidden mt-[-4px] mb-4 w-full">
                    <Badge className={badge} variant="">
                        {type}
                    </Badge>
                    {/* ...other icons/buttons... */}
                </div>
                {/* Custom CardAction for screens >= 455px */}
                <div className="min-[455px]:flex hidden justify-end mt-[-6px] mb-2">
                    <CardAction className="flex flex-row gap-0">
                        <div className="mr-1">
                            <Badge className={badge} variant="">
                                {type}
                            </Badge>
                        </div>
                        {/* ...other icons/buttons... */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button className="cursor-pointer">
                                    {/* ...delete icon... */}
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Delete Post. Are you sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={onDelete}>
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardAction>
                </div>
                <CardTitle className="leading-4 mb-2 w-full">
                    <Link
                        href={identifier ? `https://${identifier}` : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {cardTitle}
                    </Link>
                </CardTitle>
                <CardDescription className="flex flex-row items-center gap-6 w-full mt-2">
                    <Avatar>
                        <AvatarImage src={avatarSrc} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium text-primary dark:text-foreground">
                            <Link href={`/profile/${userId}`}>{author}</Link>
                        </p>
                        <p>{formatDate(createdAt)}</p>
                    </div>
                </CardDescription>
            </div>
        </CardHeader>
    );
}
