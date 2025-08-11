'use client';

import { SelectPostType } from '@/components/feed/select-post-type';
import { PaperPost } from '@/components/feed/paper-post';
import { UserPost } from '@/components/feed/user-post';
import {
    getPaperPosts,
    getUserPosts,
    getNewsPosts,
} from '@/lib/actions/actions';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useInView } from 'react-intersection-observer';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { SkeletonCard } from '@/components/skeletons/skeletonCard';

export function FeedComponent() {
    const [posts, setPosts] = useState([]); // unified feed
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10, // Smaller page size for faster loading
        totalPages: 1,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const [postType, setPostType] = useState('papers'); // 'all', 'papers', 'posts', 'news'

    // Container ref for virtualizer
    const parentRef = useRef(null);
    // Ref for the scrollable viewport inside ScrollArea
    const viewportRef = useRef(null);

    // Console logging for debugging
    const logState = useCallback(() => {
        console.log(`Current state: 
      - Posts: ${posts.length}
      - Page: ${pagination.page}/${pagination.totalPages}
      - Has more: ${hasMore}
      - Loading: ${loading}
    `);
    }, [
        posts.length,
        pagination.page,
        pagination.totalPages,
        hasMore,
        loading,
    ]);

    // Fetch data function with improved error handling
    const fetchData = useCallback(
        async (page = 1) => {
            setLoading(true);
            let token = null;
            if (
                process.env.NODE_ENV === 'development' &&
                typeof window !== 'undefined'
            ) {
                token = localStorage.getItem('token');
            }

            let result = { success: false, data: { posts: [] } };

            if (postType === 'papers') {
                result = await getPaperPosts(token, page, pagination.pageSize);
            } else if (postType === 'posts') {
                result = await getUserPosts(token, page, pagination.pageSize);
                console.log('User Posts response: ', result);
            } else if (postType === 'news') {
                result = await getNewsPosts(token, page, pagination.pageSize);
            } else if (postType === 'all') {
                const [papers, userPosts, newsPosts] = await Promise.all([
                    getPaperPosts(token, page, pagination.pageSize),
                    getUserPosts(token, page, pagination.pageSize),
                    getNewsPosts(token, page, pagination.pageSize),
                ]);
                // Merge and sort by date
                result = {
                    success: true,
                    data: {
                        posts: [
                            ...papers.data.paperPosts,
                            ...userPosts.data.userPosts,
                            ...newsPosts.data.newsPosts,
                        ].sort(
                            (a, b) =>
                                new Date(b.createdAt) - new Date(a.createdAt)
                        ),
                    },
                };
            }

            if (result.success) {
                let newPosts = [];
                if (postType === 'papers') {
                    newPosts = result.data.paperPosts;
                } else if (postType === 'posts') {
                    newPosts = result.data.userPosts;
                } else if (postType === 'news') {
                    newPosts = result.data.newsPosts;
                } else if (postType === 'all') {
                    newPosts = result.data.posts; // merged and sorted array
                }

                if (page === 1) {
                    setPosts(newPosts);
                } else {
                    setPosts((prev) => {
                        const existingIds = new Set(
                            prev.map((post) => post.id)
                        );
                        return [
                            ...prev,
                            ...newPosts.filter(
                                (post) => !existingIds.has(post.id)
                            ),
                        ];
                    });
                }

                // Update pagination info
                setPagination({
                    page: result.data.pagination.page,
                    pageSize: result.data.pagination.pageSize,
                    totalPages: result.data.pagination.totalPages,
                    total: result.data.pagination.total,
                });

                // Check if there are more pages to load
                const newHasMore =
                    result.data.pagination.page <
                    result.data.pagination.totalPages;
                console.log(`Has more pages: ${newHasMore}`);
                setHasMore(newHasMore);
            } else {
                console.error('Failed to fetch posts:', result.error);
                setError('Failed to load posts');
            }
            setLoading(false);
        },
        [postType, pagination.pageSize]
    ); // ONLY depend on pagination.pageSize

    // Initial data load
    useEffect(() => {
        fetchData(1);
    }, [fetchData]);

    // Setup intersection observer with improved options
    const { ref: loadMoreRef, inView } = useInView({
        threshold: 0,
        rootMargin: '500px 0px', // Increased margin to detect earlier
        triggerOnce: false,
    });

    // Debug logging for intersection observer
    useEffect(() => {
        if (inView) {
            console.log('Loader is in view, should load more if available');
            logState();
        }
    }, [inView, logState]);

    // Load more when the end is reached
    useEffect(() => {
        if (inView && !loading && hasMore) {
            const nextPage = pagination.page + 1;
            console.log(`Loading next page: ${nextPage}`);
            fetchData(nextPage);
        }
    }, [inView, loading, hasMore, pagination.page, fetchData]);

    // Setup virtualizer with improved config
    const rowVirtualizer = useVirtualizer({
        count: posts.length + (hasMore ? 1 : 0), // +1 for loader row
        getScrollElement: () => viewportRef.current,
        estimateSize: () => 425, // Adjusted for your card size
        overscan: 3,
    });

    // Use refs to access latest values without dependencies
    const loadingRef = useRef(false);
    const hasMoreRef = useRef(true);

    // Sync refs with state
    useEffect(() => {
        loadingRef.current = loading;
    }, [loading]);

    useEffect(() => {
        hasMoreRef.current = hasMore;
    }, [hasMore]);

    return (
        <div className="flex justify-center items-center mt-0 w-full">
            {/* <div className="fixed top-1/3 left-20">
                <div className="flex flex-col justify-center">
                    <SelectPostType
                        defaultValue={undefined}
                        className="flex justify-center"
                    />
                </div>
            </div> */}

            {/* Error handling UI */}
            {error && posts.length === 0 && (
                <div className="w-full flex flex-col justify-start items-center">
                    <SkeletonCard className="max-w-[700px] w-full" />
                    <div className="flex flex-col text-center text-red-500 mt-4 max-w-fit">
                        <span>{error}</span>
                        <Button
                            onClick={() => {
                                setError(null);
                                fetchData(1);
                            }}
                            className="mt-4"
                        >
                            Retry
                        </Button>
                    </div>
                </div>
            )}

            {/* Loading state */}
            {loading && posts.length === 0 && (
                <div className="w-full flex flex-col justify-start items-center pt-8">
                    <SkeletonCard className="max-w-[700px] w-full" />
                    <div className="text-center mt-4 w-full">
                        <span>Loading posts...</span>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {posts.length === 0 && !loading && !error && (
                <div className="w-full text-center py-8">No posts found</div>
            )}

            {/* Virtualized posts container - FIXED STYLING */}
            {posts.length > 0 && (
                <ScrollArea className="w-full max-w-[700px] h-[calc(100vh-120px)]">
                    <div
                        ref={viewportRef}
                        className="relative w-full h-full overflow-auto"
                        style={{
                            height: '100%',
                            width: '100%',
                            scrollbarGutter: 'stable',
                        }}
                    >
                        <div
                            style={{
                                height: `${rowVirtualizer.getTotalSize()}px`,
                                width: '100%',
                                position: 'relative',
                            }}
                        >
                            {rowVirtualizer
                                .getVirtualItems()
                                .map((virtualItem) => {
                                    const isLoaderRow =
                                        virtualItem.index >= posts.length;

                                    return (
                                        <div
                                            key={
                                                isLoaderRow
                                                    ? 'loader'
                                                    : `post-${posts[virtualItem.index]?.id}-idx-${virtualItem.index}`
                                            }
                                            ref={
                                                isLoaderRow ? loadMoreRef : null
                                            }
                                            className="absolute left-0 right-0 flex justify-center"
                                            style={{
                                                top: 0,
                                                height: `${virtualItem.size}px`,
                                                transform: `translateY(${virtualItem.start}px)`,
                                                padding: '8px 0',
                                            }}
                                        >
                                            {isLoaderRow && posts.length > 0 ? (
                                                hasMore ? (
                                                    <div className="flex flex-col justify-center items-center py-4 text-center w-full">
                                                        <SkeletonCard className="max-w-[700px] w-full" />
                                                        <p>
                                                            Loading more
                                                            posts...
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="py-4 text-center w-full">
                                                        No more posts to load
                                                    </div>
                                                )
                                            ) : (
                                                posts[virtualItem.index] && (
                                                    <div className="flex flex-col gap-2">
                                                        {posts[
                                                            virtualItem.index
                                                        ].type === 'paper' && (
                                                            <PaperPost
                                                                {...posts[
                                                                    virtualItem
                                                                        .index
                                                                ]}
                                                            />
                                                        )}
                                                        {posts[
                                                            virtualItem.index
                                                        ].type === 'user' && (
                                                            <UserPost
                                                                {...posts[
                                                                    virtualItem
                                                                        .index
                                                                ]}
                                                            />
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            )}
        </div>
    );
}
