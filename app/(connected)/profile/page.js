'use client';

import { PaperClipIcon } from '@heroicons/react/20/solid';
import { AlertCircleIcon, BadgeCheckIcon, CheckIcon } from 'lucide-react';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/components/context/UserProfileContext';

export default function Profile() {
    const { user } = useUser();
    return (
        <div className="mx-auto my-12 max-w-4xl bg-muted">
            <div className="flex justify-center">
                <Card className="m-4 p-8">Meter Caja de resonancia</Card>
            </div>
            <Card className="m-4 p-8">
                <div className="px-4 sm:px-0">
                    <h3 className="text-base/7 font-semibold text-primary">
                        Profile information
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm/6 text-muted-foreground">
                        Personal details.
                    </p>

                    <CardAction className="flex justify-end mt-0 mb-0 sm:mt-[-50px]">
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto mt-8 md:my-0">
                            <div className="mb-2 sm:mb-0">
                                <Badge
                                    variant="secondary"
                                    className="bg-blue-500 text-white dark:bg-blue-600"
                                >
                                    <BadgeCheckIcon />
                                    Verified
                                </Badge>
                            </div>
                            <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
                                <AvatarImage
                                    src={
                                        user
                                            ? user.photoUrl
                                            : 'https://github.com/shadcn.png'
                                    }
                                />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </div>
                    </CardAction>
                </div>
                <div className="mt-6 border-t border-border">
                    <dl className="divide-y divide-border">
                        <div className="px-4 py-6 flex flex-col sm:flex-row sm:items-center items-start sm:px-0">
                            <dt className="text-sm/6 font-bold text-primary dark:text-foreground min-w-[100px] sm:min-w-[150px]">
                                Full name
                            </dt>
                            <dd className="mt-2 sm:mt-0 text-sm/6 text-muted-foreground break-words whitespace-normal w-full">
                                {user ? user.username : 'Margot Foster'}
                            </dd>
                        </div>
                        <div className="px-4 py-6 flex flex-col sm:flex-row sm:items-center items-start sm:px-0">
                            <dt className="text-sm/6 font-bold text-primary dark:text-foreground min-w-[100px] sm:min-w-[150px]">
                                Connected accounts:
                            </dt>
                            <dd className="mt-2 sm:mt-0 text-sm/6 text-muted-foreground w-full">
                                ORCID, LinkedIN, FaceBook, Google
                            </dd>
                        </div>
                        <div className="px-4 py-6 flex flex-col sm:flex-row sm:items-center items-start sm:px-0">
                            <dt className="text-sm/6 font-bold text-primary dark:text-foreground min-w-[100px] sm:min-w-[150px]">
                                Email address
                            </dt>
                            <dd className="mt-2 sm:mt-0 text-sm/6 text-muted-foreground break-words whitespace-normal w-full">
                                margotfoster@example.com
                            </dd>
                        </div>
                        <div className="px-4 py-6 flex flex-col sm:flex-row sm:items-center items-start sm:px-0">
                            <dt className="text-sm/6 font-bold text-primary dark:text-foreground min-w-[100px] sm:min-w-[150px]">
                                Posts
                            </dt>
                            <dd className="mt-2 sm:mt-0 text-sm/6 text-muted-foreground w-full">
                                see posts
                            </dd>
                        </div>
                        <div className="px-4 py-6 flex flex-col sm:flex-row sm:items-center items-start sm:px-0">
                            <dt className="text-sm/6 font-bold text-primary dark:text-foreground min-w-[100px] sm:min-w-[150px]">
                                About
                            </dt>
                            <dd className="mt-2 sm:mt-0 text-sm/6 text-muted-foreground w-full">
                                {user
                                    ? user.about
                                    : 'Let the community know your areas of expertise'}
                            </dd>
                        </div>
                        <div className="px-4 py-6 flex flex-col sm:flex-row sm:items-center items-start sm:px-0">
                            <dt className="text-sm/6 font-bold text-primary dark:text-foreground min-w-[100px] sm:min-w-[150px]">
                                Followers
                            </dt>
                            <dd className="mt-2 sm:mt-0 text-sm/6 text-muted-foreground w-full">
                                (155) | Expand Followers
                            </dd>
                        </div>
                        <div className="px-4 py-6 flex flex-col sm:flex-row sm:items-center items-start sm:px-0">
                            <dt className="text-sm/6 font-bold text-primary dark:text-foreground min-w-[100px] sm:min-w-[150px]">
                                Following
                            </dt>
                            <dd className="mt-2 sm:mt-0 text-sm/6 text-muted-foreground w-full">
                                (24) | Expand Profiles
                            </dd>
                        </div>
                    </dl>
                </div>
            </Card>

            <Card className="m-4 p-8">Followers</Card>
            <Card className="m-4 p-8">Following</Card>
        </div>
    );
}
