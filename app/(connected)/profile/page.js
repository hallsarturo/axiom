'use client';

import { PaperClipIcon } from '@heroicons/react/20/solid';
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
import { useUser } from '@/components/context/UserProfileContext';

export default function Profile() {
    const { user } = useUser();
    return (
        <div className="mx-auto my-12 max-w-4xl bg-muted">
            <Card className="p-8">
                <div className="px-4 sm:px-0">
                    <h3 className="text-base/7 font-semibold text-primary">
                        Profile information
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm/6 text-muted-foreground">
                        Personal details.
                    </p>
                    <CardAction
                        className="flex justify-end"
                        style={{ marginTop: '-50px', marginBottom: '0px' }}
                    >
                        <Avatar className="w-24 h-24">
                            <AvatarImage
                                src={
                                    user
                                        ? user.photoUrl
                                        : 'https://github.com/shadcn.png'
                                }
                            />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </CardAction>
                </div>
                <div className="mt-6 border-t border-border">
                    <dl className="divide-y divide-border">
                        <div className="px-4 py-6 flex items-start sm:px-0">
                            <dt className="text-sm/6 font-medium text-foreground min-w-[150px]">
                                Full name
                            </dt>
                            <dd className="ml-12 text-sm/6 text-muted-foreground">
                                {user ? user.username : 'Margot Foster'}
                            </dd>
                        </div>
                        <div className="px-4 py-6 flex items-start sm:px-0">
                            <dt className="text-sm/6 font-medium text-foreground min-w-[150px]">
                                Connected accounts:
                            </dt>
                            <dd className="ml-12 text-sm/6 text-muted-foreground">
                                ORCID, LinkedIN, FaceBook, Google
                            </dd>
                        </div>
                        <div className="px-4 py-6 flex items-start sm:px-0">
                            <dt className="text-sm/6 font-medium text-foreground min-w-[150px]">
                                Email address
                            </dt>
                            <dd className="ml-12 text-sm/6 text-muted-foreground">
                                margotfoster@example.com
                            </dd>
                        </div>
                        <div className="px-4 py-6 flex items-start sm:px-0">
                            <dt className="text-sm/6 font-medium text-foreground min-w-[150px]">
                                Posts
                            </dt>
                            <dd className="ml-12 text-sm/6 text-muted-foreground">
                                see posts
                            </dd>
                        </div>
                        <div className="px-4 py-6 flex items-start sm:px-0">
                            <dt className="text-sm/6 font-medium text-foreground min-w-[150px]">
                                About
                            </dt>
                            <dd className="ml-12 text-sm/6 text-muted-foreground">
                                Fugiat ipsum ipsum deserunt culpa aute sint do
                                nostrud anim incididunt cillum culpa consequat.
                                Excepteur qui ipsum aliquip consequat sint. Sit
                                id mollit nulla mollit nostrud in ea officia
                                proident. Irure nostrud pariatur mollit ad
                                adipisicing reprehenderit deserunt qui eu.
                            </dd>
                        </div>
                        <div className="px-4 py-6 flex items-start sm:px-0">
                            <dt className="text-sm/6 font-medium text-foreground min-w-[150px]">
                                Followers
                            </dt>
                            <dd className="ml-12 text-sm/6 text-muted-foreground">
                                (155) | Expand Followers
                            </dd>
                        </div>
                        <div className="px-4 py-6 flex items-start sm:px-0">
                            <dt className="text-sm/6 font-medium text-foreground min-w-[150px]">
                                Following
                            </dt>
                            <dd className="ml-12 text-sm/6 text-muted-foreground">
                                (24) | Expand Profiles
                            </dd>
                        </div>
                    </dl>
                </div>
            </Card>
        </div>
    );
}
