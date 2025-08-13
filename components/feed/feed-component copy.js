'use client';

import { SelectPostType } from '@/components/feed/select-post-type';
import { PaperPost } from '@/components/feed/paper-post';
import { UserPost } from '@/components/feed/user-post';
import { PublishPost } from '@/components/feed/publish-post';
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
import { toast } from 'sonner';
import useSWR from 'swr';

// 1. Create a better combined pagination tracker for 'all' post type
const fetchFeed = async (postType, token, page, pageSize, timestamp) => {
    if (postType === 'papers') {
        return getPaperPosts(token, page, pageSize, timestamp);
    }
    if (postType === 'posts') {
        return getUserPosts(token, page, pageSize, timestamp);
    }
    if (postType === 'news') {
        return getNewsPosts(token, page, pageSize, timestamp);
    }

    // For 'all' type, use a simpler approach
    if (postType === 'all') {
        // Get stored pagination state
        const storedPaginations =
            typeof window !== 'undefined'
                ? JSON.parse(localStorage.getItem('feedPaginations') || '{}')
                : {};

        let paperPage = storedPaginations.paperPage || 1;
        let userPage = storedPaginations.userPage || 1;
        let paperHasMore = storedPaginations.paperHasMore !== false;
        let userHasMore = storedPaginations.userHasMore !== false;

        let paperResults = { data: { paperPosts: [] } };
        let userResults = { data: { userPosts: [] } };

        // Always try to load both if possible
        if (paperHasMore) {
            paperResults = await getPaperPosts(
                token,
                paperPage,
                pageSize,
                timestamp
            );
            paperHasMore = paperResults.data.paperPosts?.length === pageSize;
            paperPage += 1;
        }
        if (userHasMore) {
            userResults = await getUserPosts(
                token,
                userPage,
                pageSize,
                timestamp
            );
            userHasMore = userResults.data.userPosts?.length === pageSize;
            userPage += 1;
        }

        // Store updated pagination
        if (typeof window !== 'undefined') {
            localStorage.setItem(
                'feedPaginations',
                JSON.stringify({
                    paperPage,
                    userPage,
                    paperHasMore,
                    userHasMore,
                })
            );
        }

        const combinedPosts = [
            ...(paperResults.data.paperPosts || []),
            ...(userResults.data.userPosts || []),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const hasMore = paperHasMore || userHasMore;

        return {
            success: true,
            data: {
                posts: combinedPosts,
                pagination: {
                    page,
                    pageSize,
                    totalPages: hasMore ? page + 1 : page,
                    total: combinedPosts.length,
                },
            },
        };
    }
};

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
    const [cardEstimate, setCardEstimate] = useState(425);

    // Container ref for virtualizer
    const parentRef = useRef(null);
    // Ref for the scrollable viewport inside ScrollArea
    const viewportRef = useRef(null);

    const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const {
        data,
        error: swrError,
        mutate,
        isValidating,
    } = useSWR(
        ['feed', postType, token, pagination.page, pagination.pageSize],
        () => fetchFeed(postType, token, pagination.page, pagination.pageSize),
        {
            refreshInterval: 0, // stop background refresh
            revalidateOnFocus: false,
            dedupingInterval: 15000,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
            refreshWhenHidden: false,
            onSuccess: () => {},
        }
    );

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
            let result = { success: false, data: { posts: [] } };

            if (postType === 'papers') {
                const timestamp = new Date().getTime();
                result = await getPaperPosts(
                    token,
                    page,
                    pagination.pageSize,
                    timestamp
                ); // [`getPaperPosts`](lib/actions/actions.js)
            } else if (postType === 'posts') {
                result = await getUserPosts(token, page, pagination.pageSize);
            } else if (postType === 'news') {
                // result = await getNewsPosts(token, page, pagination.pageSize);
            } else if (postType === 'all') {
                const [papers, userPosts] = await Promise.all([
                    getPaperPosts(token, page, pagination.pageSize),
                    getUserPosts(token, page, pagination.pageSize),
                ]);
                result = {
                    success: true,
                    data: {
                        posts: [
                            ...papers.data.paperPosts,
                            ...userPosts.data.userPosts,
                        ].sort(
                            (a, b) =>
                                new Date(b.createdAt) - new Date(a.createdAt)
                        ),
                        pagination: {
                            page,
                            pageSize: pagination.pageSize,
                            totalPages:
                                (papers.data.pagination?.totalPages ?? page) >
                                    page ||
                                (userPosts.data.pagination?.totalPages ??
                                    page) > page
                                    ? page + 1
                                    : page,
                            total:
                                (papers.data.paperPosts?.length ?? 0) +
                                (userPosts.data.userPosts?.length ?? 0),
                        },
                    },
                };
            }

            if (result.success) {
                let newPosts = [];
                if (postType === 'papers') newPosts = result.data.paperPosts;
                else if (postType === 'posts') newPosts = result.data.userPosts;
                else if (postType === 'news') newPosts = [];
                else if (postType === 'all') newPosts = result.data.posts;

                if (page === 1) {
                    setPosts(newPosts);
                } else {
                    setPosts((prev) => {
                        const existingIds = new Set(prev.map((p) => p.id));
                        return [
                            ...prev,
                            ...newPosts.filter((p) => !existingIds.has(p.id)),
                        ];
                    });
                }

                if (result.data.pagination) {
                    setPagination((prev) => ({
                        ...prev,
                        page,
                        pageSize:
                            result.data.pagination.pageSize ?? prev.pageSize,
                        totalPages:
                            result.data.pagination.totalPages ??
                            prev.totalPages,
                        total: result.data.pagination.total ?? prev.total,
                    }));
                    // Use backend pagination for papers; otherwise fallback to page-size check
                    const nextHasMore =
                        postType === 'papers'
                            ? page < (result.data.pagination.totalPages ?? page)
                            : newPosts.length === pagination.pageSize;
                    setHasMore(nextHasMore);
                } else {
                    setHasMore(newPosts.length === pagination.pageSize);
                }
            } else {
                console.error('Failed to fetch posts:', result.error);
                setError('Failed to load posts');
            }
            setLoading(false);
        },
        [postType, pagination.pageSize, token]
    ); // ONLY depend on pagination.pageSize

    // Initial data load
    useEffect(() => {
        fetchData(1);
    }, [fetchData]);

    // REMOVE this effect entirely:
    // useEffect(() => {
    //     if (data && data.success) {
    //         let newPosts = [];
    //         if (postType === 'papers') {
    //             newPosts = data.data.paperPosts;
    //         } else if (postType === 'posts') {
    //             newPosts = data.data.userPosts;
    //         } else if (postType === 'news') {
    //             newPosts = [];
    //         } else if (postType === 'all') {
    //             newPosts = data.data.posts;
    //         }

    //         // Only update posts - don't touch pagination here
    //         setPosts(newPosts);

    //         // Don't update pagination or hasMore states here at all
    //         // This lets your fetchData function control pagination
    //     }
    // }, [data, postType]);

    // Setup intersection observer
    const { ref: loadMoreRef, inView } = useInView({
        threshold: 0.6,
        rootMargin: '150px 0px',
        triggerOnce: false,
        root: viewportRef.current,
    });

    // Only trigger on inView transition (false -> true)
    const wasInViewRef = useRef(false);
    useEffect(() => {
        if (inView && !wasInViewRef.current) {
            wasInViewRef.current = true;
            if (!loading && hasMore) {
                const nextPage = pagination.page + 1;
                console.log(`🔄 FETCH NEXT PAGE (transition): ${nextPage}`);
                fetchData(nextPage);
            }
        } else if (!inView && wasInViewRef.current) {
            wasInViewRef.current = false;
        }
    }, [inView, loading, hasMore, pagination.page, fetchData]);

    // Setup virtualizer with improved config
    const rowVirtualizer = useVirtualizer({
        count: posts.length + (hasMore ? 1 : 0),
        getScrollElement: () => viewportRef.current,
        estimateSize: () => cardEstimate,
        overscan: 3,
    });

    // Use refs to access latest values without dependencies
    const loadingRef = useRef(false);
    const hasMoreRef = useRef(true);
    const lastOptimisticPostRef = useRef(null);

    // Sync refs with state
    useEffect(() => {
        loadingRef.current = loading;
    }, [loading]);

    useEffect(() => {
        hasMoreRef.current = hasMore;
    }, [hasMore]);

    useEffect(() => {
        let timeout;
        function handleResize() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                setCardEstimate(window.innerWidth < 527 ? 600 : 425);
                if (rowVirtualizer) rowVirtualizer.measure();
            }, 100); // 100ms debounce
        }
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [rowVirtualizer]);

    function handlePostPublished(newPost) {
        // Simply trigger a full refresh of the feed
        toast.success('Post published!');

        // Reset pagination to first page
        setPagination((prev) => ({
            ...prev,
            page: 1,
        }));

        // Refresh data completely - this is the most reliable approach
        mutate();

        // Also refresh local data by calling fetchData
        fetchData(1);
    }

    // Log when component renders
    useEffect(() => {
        console.log('FeedComponent rendering:', {
            postsCount: posts.length,
            currentPage: pagination.page,
            totalPages: pagination.totalPages,
            hasMore,
            loading,
            postType,
        });
    }, [
        posts.length,
        pagination.page,
        pagination.totalPages,
        hasMore,
        loading,
        postType,
    ]);

    // Track fetchData calls
    const fetchDataWithLogging = useCallback(
        async (page) => {
            console.log(`📥 fetchData CALLED with page: ${page}`);
            const result = await fetchData(page);
            console.log(`📤 fetchData COMPLETED for page: ${page}`);
            return result;
        },
        [fetchData]
    );

    // Add this to reset pagination when changing post type
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('feedPaginations');
        }
        setPagination({
            page: 1,
            pageSize: 10,
            totalPages: 1,
            total: 0,
        });
        setHasMore(true);
        fetchData(1);
    }, [postType, fetchData]);

    return (
        <div className="flex flex-col justify-center">
            <div className="flex w-full justify-center">
                <PublishPost mutateFeed={handlePostPublished} />
            </div>

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
                    <div className="w-full text-center py-8">
                        No posts found
                    </div>
                )}
                {/* Virtualized posts container - FIXED STYLING */}
                {posts.length > 0 && (
                    <ScrollArea className="w-full h-[calc(100vh-150px)]">
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
                                                        : `post-${posts[virtualItem.index]?.id}` // stable key, no index suffix
                                                }
                                                className="absolute left-0 right-0 flex justify-center"
                                                style={{
                                                    top: 0,
                                                    height: `${virtualItem.size}px`,
                                                    transform: `translateY(${virtualItem.start}px)`,
                                                }}
                                            >
                                                {isLoaderRow &&
                                                posts.length > 0 ? (
                                                    <div
                                                        ref={loadMoreRef} // attach ONLY here
                                                        className="py-6 w-full bg-red-100 dark:bg-red-900/30"
                                                        style={{
                                                            height: '100px',
                                                            border: '2px dashed red',
                                                            margin: '10px 0',
                                                        }}
                                                    >
                                                        {hasMore ? (
                                                            <div className="flex flex-col justify-center items-center">
                                                                <p className="text-base font-bold">
                                                                    Loading more
                                                                    posts...
                                                                </p>
                                                                <p className="text-sm">
                                                                    hasMore:{' '}
                                                                    {hasMore
                                                                        ? 'true'
                                                                        : 'false'}
                                                                    , loading:{' '}
                                                                    {loading
                                                                        ? 'true'
                                                                        : 'false'}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div className="py-2 text-center w-full">
                                                                <p className="font-bold">
                                                                    End of feed
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    posts[
                                                        virtualItem.index
                                                    ] && (
                                                        <div className="flex flex-col gap-2">
                                                            {posts[
                                                                virtualItem
                                                                    .index
                                                            ].type ===
                                                                'paper' && (
                                                                <PaperPost
                                                                    {...posts[
                                                                        virtualItem
                                                                            .index
                                                                    ]}
                                                                    mutateFeed={
                                                                        mutate
                                                                    }
                                                                    refreshFeed={
                                                                        fetchData
                                                                    }
                                                                />
                                                            )}
                                                            {posts[
                                                                virtualItem
                                                                    .index
                                                            ].type ===
                                                                'user' && (
                                                                <UserPost
                                                                    {...posts[
                                                                        virtualItem
                                                                            .index
                                                                    ]}
                                                                    mutateFeed={
                                                                        mutate
                                                                    }
                                                                    refreshFeed={
                                                                        fetchData
                                                                    }
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
        </div>
    );
}
