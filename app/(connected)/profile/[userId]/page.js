'use client';

import { PaperClipIcon } from '@heroicons/react/20/solid';
import {
    AlertCircleIcon,
    BadgeCheckIcon,
    CheckIcon,
    UserPlus,
} from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/components/context/UserProfileContext';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
    getUserProfileById,
    getFollowersById,
    getFollowingsById,
} from '@/lib/actions/actions';

export default function Profile() {
    const { userId } = useParams();
    const [profileInfo, setProfileInfo] = useState(null);
    const { user } = useUser();
    const [followers, setFollowers] = useState([]);
    const [followersCount, setFollowersCount] = useState(0);
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        async function fetchProfile() {
            const result = await getUserProfileById(userId);
            if (result && result.user) {
                setProfileInfo(result.user);
            } else {
                setProfileInfo(null);
            }
        }
        fetchProfile();
    }, [userId]);

    // Check if this is the user's profile or not
    const isOwnProfile = user && user.id && String(user.id) === String(userId);

    // Followers
    useEffect(() => {
        async function fetchFollowers() {
            const result = await getFollowersById(userId);
            if (result && Array.isArray(result.followers)) {
                setFollowers(result.followers);
                setFollowersCount(
                    result.totalFollowers ?? result.followers.length
                );
            } else {
                setFollowers([]);
                setFollowersCount(0);
            }
        }
        fetchFollowers();
    }, [userId]);

    // Following
    useEffect(() => {
        async function fetchFollowings() {
            const result = await getFollowingsById(userId);
            if (result && result.followers) {
                setFollowing(result.followers.totalFollowers);
            } else {
                setFollowing(null);
            }
        }
        fetchFollowings();
    }, [userId]);

    return (
        <div className="mx-auto my-12 max-w-4xl bg-muted">
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
                                        profileInfo
                                            ? profileInfo.photoUrl
                                            : 'https://github.com/shadcn.png'
                                    }
                                />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </div>
                    </CardAction>
                    {isOwnProfile ? null : (
                        <Button>
                            {' '}
                            <UserPlus /> Follow
                        </Button>
                    )}
                </div>
                <div className="mt-6 border-t border-border">
                    <dl className="divide-y divide-border">
                        <div className="px-4 py-6 flex flex-col sm:flex-row sm:items-center items-start sm:px-0">
                            <dt className="text-sm/6 font-bold text-primary dark:text-foreground min-w-[100px] sm:min-w-[150px]">
                                Full name
                            </dt>
                            <dd className="mt-2 sm:mt-0 text-sm/6 text-muted-foreground break-words whitespace-normal w-full">
                                {profileInfo
                                    ? profileInfo.username
                                    : 'Margot Foster'}
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
                                (12) | see posts
                            </dd>
                        </div>
                        <div className="px-4 py-6 flex flex-col sm:flex-row sm:items-center items-start sm:px-0">
                            <dt className="text-sm/6 font-bold text-primary dark:text-foreground min-w-[100px] sm:min-w-[150px]">
                                About
                            </dt>
                            <dd className="mt-2 sm:mt-0 text-sm/6 text-muted-foreground w-full">
                                {profileInfo
                                    ? profileInfo.about
                                    : 'Let the community know your areas of expertise'}
                            </dd>
                        </div>
                        <div className="px-4 py-6 flex flex-col sm:flex-row sm:items-center items-start sm:px-0">
                            <dt className="text-sm/6 font-bold text-primary dark:text-foreground min-w-[100px] sm:min-w-[150px]">
                                Followers
                            </dt>
                            <dd className="mt-2 sm:mt-0 text-sm/6 text-muted-foreground w-full">
                                {followersCount } | Expand Followers
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
        </div>
    );
}
