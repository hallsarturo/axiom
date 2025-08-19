'use client';

import { useState, useEffect } from 'react';
import { getPostsById } from '@/lib/actions/actions';
import { normalizeImageUrl } from '@/lib/utils/image';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useUser } from '@/components/context/UserProfileContext';

export default function MyPosts() {
    const { pageId } = useParams();
    const { user } = useUser();
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        async function fetchPosts() {
            const result = await getPostsById(pageId, page, 8); // 8 posts per page
            if (result && result.posts) {
                setPosts(result.posts);
                setTotalPages(result.pagination?.totalPages || 1);
            } else {
                setPosts([]);
                setTotalPages(1);
            }
        }
        fetchPosts();
    }, [pageId, page]);

    return (
        <div className="bg-white m-8">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    My Posts
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {posts.map((post) => (
                        <div key={post.id} className="group relative">
                            <Image
                                alt={post.title || 'Post image'}
                                src={normalizeImageUrl(post.imgSrc)}
                                width={400}
                                height={400}
                                className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                            />
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm text-gray-700">
                                        <Link href={`/posts/${post.id}`}>
                                            <span
                                                aria-hidden="true"
                                                className="absolute inset-0"
                                            />
                                            {post.title}
                                        </Link>
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {post.author}
                                    </p>
                                </div>
                                <p className="text-sm font-medium text-gray-900">
                                    {post.createdAt}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

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
