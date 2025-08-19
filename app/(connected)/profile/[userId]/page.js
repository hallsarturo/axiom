'use client';

import { PaperClipIcon } from '@heroicons/react/20/solid';
import {
    AlertCircleIcon,
    BadgeCheckIcon,
    CheckIcon,
    UserPlus,
    UserMinus,
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
import { toast } from 'sonner';
import { useUser } from '@/components/context/UserProfileContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    getUserProfileById,
    getFollowersById,
    getFollowingsById,
    putFollower,
    getPostsById,
} from '@/lib/actions/actions';
import { timeAgo } from '@/lib/utils/date';
import useSWR from 'swr';

const fetchFollowers = async (userId) => {
    const result = await getFollowersById(userId);
    return result || { followers: [], totalFollowers: 0 };
};

const fetchFollowings = async (userId) => {
    const result = await getFollowingsById(userId);
    return result || { following: [], totalFollowings: 0 };
};

export default function Profile() {
    const { userId } = useParams();
    const { user } = useUser();
    const [profileInfo, setProfileInfo] = useState(null);
    const [followers, setFollowers] = useState([]);
    const [followersCount, setFollowersCount] = useState(0);
    const [following, setFollowing] = useState([]);
    const [followingCount, setFollowingCount] = useState(0);
    const [totalPosts, setTotalPosts] = useState();

    // SWR hooks for followers and following
    const {
        data: followersData,
        mutate: mutateFollowers,
        isLoading: loadingFollowers,
    } = useSWR(['followers', userId], () => fetchFollowers(userId));

    const {
        data: followingData,
        mutate: mutateFollowing,
        isLoading: loadingFollowing,
    } = useSWR(['following', userId], () => fetchFollowings(userId));

    useEffect(() => {
        async function fetchProfile() {
            const result = await getUserProfileById(userId);
            setProfileInfo(result?.user || null);
        }
        fetchProfile();
    }, [userId]);

    // Get user's total posts count
    useEffect(() => {
        async function fetchPosts() {
            const result = await getPostsById(userId);
            setTotalPosts(result?.totalCount);
        }
        fetchPosts();
    }, [userId]);

    // Check if this is the user's profile or not
    const isOwnProfile = user && user.id && String(user.id) === String(userId);

    // Check if current user is following
    const isFollowing =
        followersData?.followers.some(
            (f) => String(f.id) === String(user?.id)
        ) ?? false;

    // Handle following targets
    const handleFollow = async () => {
        if (!user || !user.id) return;
        let token = null;
        if (process.env.NODE_ENV === 'development') {
            token = localStorage.getItem('token');
        }
        const result = await putFollower(token, userId);
        if (result?.message === 'Unfollowed user.') {
            toast.success(`User unfollowed`);
        } else if (result?.message === 'Followed user.') {
            toast.success(`User followed`);
        } else {
            toast.error('Action failed');
        }
        // SWR refresh
        mutateFollowers();
        mutateFollowing();
    };

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
                    <h3 className="text-2xl pt-4">
                        {profileInfo ? profileInfo.username : 'Margot Foster'}
                    </h3>
                    <CardAction className="flex justify-end mt-0 mb-0 sm:mt-[-70px]">
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

                    {!isOwnProfile && (
                        <Button
                            onClick={handleFollow}
                            variant={isFollowing ? 'secondary' : 'default'}
                            className={`${isFollowing ? 'text-primary dark:text-foreground' : ''} `}
                        >
                            {isFollowing ? (
                                <>
                                    <UserMinus /> Unfollow
                                </>
                            ) : (
                                <>
                                    <UserPlus /> Follow
                                </>
                            )}
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
                                Member since:
                            </dt>
                            <dd className="mt-2 sm:mt-0 text-sm/6 text-muted-foreground w-full">
                                {profileInfo
                                    ? timeAgo(profileInfo.createdAt)
                                    : null}
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
                                {profileInfo ? profileInfo.email : null}
                            </dd>
                        </div>
                        <div className="px-4 py-6 flex flex-col sm:flex-row sm:items-center items-start sm:px-0">
                            <dt className="text-sm/6 font-bold text-primary dark:text-foreground min-w-[100px] sm:min-w-[150px]">
                                Posts
                            </dt>
                            <dd className="mt-2 sm:mt-0 text-sm/6 text-muted-foreground w-full">
                                {totalPosts ? totalPosts : null} |{' '}
                                <Link href={`/my-posts/${userId}`}>
                                    see posts
                                </Link>
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
                                {followersData?.totalFollowers ?? 0} |{' '}
                                <Link href={`/followers/${userId}`}>
                                    see followers
                                </Link>
                            </dd>
                        </div>
                        <div className="px-4 py-6 flex flex-col sm:flex-row sm:items-center items-start sm:px-0">
                            <dt className="text-sm/6 font-bold text-primary dark:text-foreground min-w-[100px] sm:min-w-[150px]">
                                Following
                            </dt>
                            <dd className="mt-2 sm:mt-0 text-sm/6 text-muted-foreground w-full">
                                {followingData?.totalFollowings ?? 0} |{' '}
                                <Link href={`/following/${userId}`}>
                                    see followings
                                </Link>
                            </dd>
                        </div>
                    </dl>
                </div>
            </Card>
        </div>
    );
}
