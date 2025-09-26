'use client';

import { useState, useEffect } from 'react';
import { getFollowersById, getUserProfileById } from '@/lib/actions/client-actions';
import { timeAgo } from '@/lib/utils/date';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { AvatarList } from '@/components/profile/avatar-list';

export default function Followers() {
    const { userId } = useParams();
    const [follower, setFollower] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        async function fetchFollowers() {
            const result = await getFollowersById(userId, page, 8); // 8 posts per page
            // if (result && result.posts) {
            //     setPosts(result.posts);
            //     setTotalPages(result.pagination?.totalPages || 1);
            // } else {
            //     setPosts([]);
            //     setTotalPages(1);
            // }
            setFollower(result?.followers || []);
        }
        fetchFollowers();
    }, [userId, page]);

    useEffect(() => {
        async function getProfile() {
            const data = await getUserProfileById(userId);
            setProfile(data?.user || null);
        }
        getProfile();
    }, [userId]);

    return (
        <div>
            <Card className="m-8">
                <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
                    <h2 className="text-2xl font-bold tracking-tight text-primary dark:text-primary-foreground -mt-8">
                        {profile ? profile.username : ''}&apos;s{' '}
                        <span className="font-normal ml-2">Followers:</span>
                    </h2>
                    <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-6 xl:gap-x-8">
                        {follower.map((f) => {
                            return (
                                <div key={f.id} className="flex justify-center">
                                    {
                                        <div className="flex justify-center text-center">
                                            <Link href={`/profile/${f.id}`}>
                                                <AvatarList
                                                    size="h-36 w-36"
                                                    userProfilePic={
                                                        f.userProfilePic
                                                    }
                                                    photoUrl={f.photoUrl}
                                                    username={
                                                        f.username ||
                                                        f.displayName
                                                    }
                                                />
                                                <div className="mt-4 flex flex-col">
                                                    <div className="flex flex-col">
                                                        <h3 className="text-sm font-bold text-primary dark:text-primary-foreground">
                                                            {f.username ||
                                                                f.displayName}
                                                        </h3>
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            follower since:{' '}
                                                            {timeAgo(
                                                                f.createdAt
                                                            )}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-900"></p>
                                                </div>
                                            </Link>
                                        </div>
                                    }
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Card>
            <div className="mb-4">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={() =>
                                    setPage((p) => Math.max(1, p - 1))
                                }
                                disabled={page === 1}
                            />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, idx) => (
                            <PaginationItem key={idx}>
                                <PaginationLink
                                    href="#"
                                    isActive={page === idx + 1}
                                    onClick={() => setPage(idx + 1)}
                                >
                                    {idx + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={() =>
                                    setPage((p) => Math.min(totalPages, p + 1))
                                }
                                disabled={page === totalPages}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
