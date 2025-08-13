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

        // Default to fetching both types on first page
        let paperResults = { data: { paperPosts: [] } };
        let userResults = { data: { userPosts: [] } };

        if (page === 1) {
            // First page: get both types
            [paperResults, userResults] = await Promise.all([
                getPaperPosts(token, 1, pageSize, timestamp),
                getUserPosts(token, 1, pageSize, timestamp),
            ]);

            // Store initial state
            if (typeof window !== 'undefined') {
                localStorage.setItem(
                    'feedPaginations',
                    JSON.stringify({
                        lastType: 'paper',
                        paperPage: 1,
                        userPage: 1,
                        paperHasMore:
                            paperResults.data.paperPosts?.length >= pageSize,
                        userHasMore:
                            userResults.data.userPosts?.length >= pageSize,
                    })
                );
            }
        } else {
            // For subsequent pages, alternate between types if both have more content
            const lastType = storedPaginations.lastType || 'paper';
            const paperHasMore = storedPaginations.paperHasMore !== false;
            const userHasMore = storedPaginations.userHasMore !== false;

            let nextType = 'paper'; // Default to papers if we don't know

            // If both have more, alternate
            if (paperHasMore && userHasMore) {
                nextType = lastType === 'paper' ? 'user' : 'paper';
            }
            // Otherwise use the one that has more
            else if (paperHasMore) {
                nextType = 'paper';
            } else if (userHasMore) {
                nextType = 'user';
            }

            // Fetch the next batch based on type
            if (nextType === 'paper') {
                const paperPage = storedPaginations.paperPage || 1;
                paperResults = await getPaperPosts(
                    token,
                    paperPage,
                    pageSize,
                    timestamp
                );

                if (typeof window !== 'undefined') {
                    localStorage.setItem(
                        'feedPaginations',
                        JSON.stringify({
                            ...storedPaginations,
                            lastType: 'paper',
                            paperPage: paperPage + 1,
                            paperHasMore:
                                paperResults.data.paperPosts?.length >=
                                pageSize,
                        })
                    );
                }
            } else {
                const userPage = storedPaginations.userPage || 1;
                userResults = await getUserPosts(
                    token,
                    userPage,
                    pageSize,
                    timestamp
                );

                if (typeof window !== 'undefined') {
                    localStorage.setItem(
                        'feedPaginations',
                        JSON.stringify({
                            ...storedPaginations,
                            lastType: 'user',
                            userPage: userPage + 1,
                            userHasMore:
                                userResults.data.userPosts?.length >= pageSize,
                        })
                    );
                }
            }
        }

        // Combine results
        const combinedPosts = [
            ...(paperResults.data.paperPosts || []),
            ...(userResults.data.userPosts || []),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Get current storage to check if we have more content
        const currentStorage =
            typeof window !== 'undefined'
                ? JSON.parse(localStorage.getItem('feedPaginations') || '{}')
                : {};

        const hasMore =
            currentStorage.paperHasMore || currentStorage.userHasMore;

        return {
            success: true,
            data: {
                posts: combinedPosts,
                pagination: {
                    page,
                    pageSize,
                    totalPages: hasMore ? 1000 : page, // Large number if more content
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
    const [postType, setPostType] = useState('all'); // 'all', 'papers', 'posts', 'news'
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
            refreshInterval: 60000, // Refresh every 60 seconds
            revalidateOnFocus: true,
            dedupingInterval: 15000,
            // Force revalidation from server on every refresh interval
            revalidateIfStale: true,
            revalidateOnReconnect: true,
            refreshWhenHidden: false,
            // This function forces a complete revalidation
            onSuccess: (data) => {
                // toast.success('Feed updated with latest posts');
            },
            // This is the key change - create a custom fetcher wrapper
            fetcher: async (...args) => {
                // Add a cache-busting parameter to force fresh data from server
                const timestamp = new Date().getTime();
                const result = await fetchFeed(
                    postType,
                    token,
                    args[2], // Use the page parameter from SWR key
                    pagination.pageSize,
                    timestamp
                );
                return result;
            },
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
                const timestamp = new Date().getTime(); // Add cache busting
                result = await getPaperPosts(
                    token,
                    page,
                    pagination.pageSize,
                    timestamp
                );
            } else if (postType === 'posts') {
                result = await getUserPosts(token, page, pagination.pageSize);
                console.log('User Posts response: ', result);
            } else if (postType === 'news') {
                // result = await getNewsPosts(token, page, pagination.pageSize);
            } else if (postType === 'all') {
                const [papers, userPosts, newsPosts] = await Promise.all([
                    getPaperPosts(token, page, pagination.pageSize),
                    getUserPosts(token, page, pagination.pageSize),
                    // getNewsPosts(token, page, pagination.pageSize),
                ]);
                // Merge and sort by date
                result = {
                    success: true,
                    data: {
                        posts: [
                            ...papers.data.paperPosts,
                            ...userPosts.data.userPosts,
                            // ...newsPosts.data.newsPosts,
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
                    newPosts = []; // No news posts, so empty array
                } else if (postType === 'all') {
                    newPosts = result.data.posts;
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

                // Only update pagination if it exists
                if (result.data.pagination) {
                    setPagination((prevPagination) => {
                        // Store the new pagination info
                        const newPagination = {
                            ...prevPagination,
                            page: page,
                            pageSize: result.data.pagination.pageSize,
                            totalPages: Math.max(
                                2,
                                result.data.pagination.totalPages
                            ), // Force at least 2 pages
                            total: result.data.pagination.total,
                        };

                        // IMPORTANT: Always keep hasMore true until we get fewer posts than requested
                        const gotFullPage =
                            newPosts.length >= pagination.pageSize;
                        const debugInfo = {
                            newPostsLength: newPosts.length,
                            pageSize: pagination.pageSize,
                            gotFullPage,
                            currentPage: page,
                            apiTotalPages: result.data.pagination.totalPages,
                        };
                        console.log('🔍 DEBUG hasMore calculation:', debugInfo);
                        // FORCE hasMore to true for testing if we got a full page
                        setHasMore(gotFullPage);

                        return newPagination;
                    });
                } else {
                    // For news, set default pagination and hasMore
                    setPagination((prev) => ({
                        ...prev,
                        page: 1,
                        totalPages: 1,
                        total: 0,
                    }));
                    setHasMore(false);
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

    // Sync SWR data with local state
    useEffect(() => {
        if (data && data.success) {
            let newPosts = [];
            if (postType === 'papers') {
                newPosts = data.data.paperPosts;
            } else if (postType === 'posts') {
                newPosts = data.data.userPosts;
            } else if (postType === 'news') {
                newPosts = [];
            } else if (postType === 'all') {
                newPosts = data.data.posts;
            }

            // Only update posts - don't touch pagination here
            setPosts(newPosts);

            // Don't update pagination or hasMore states here at all
            // This lets your fetchData function control pagination
        }
    }, [data, postType]);

    // Setup intersection observer with improved options
    const { ref: loadMoreRef, inView } = useInView({
        threshold: 0.5, // Much higher threshold - element needs to be half visible
        rootMargin: '0px', // No margin
        triggerOnce: false,
        root: viewportRef.current,
    });

    // Debug logging for intersection observer
    useEffect(() => {
        if (inView) {
            console.log('⚠️ LOADER IN VIEW - State:', {
                loading,
                hasMore,
                currentPage: pagination.page,
                totalPages: pagination.totalPages,
                inView,
            });

            if (!loading && hasMore) {
                const nextPage = pagination.page + 1;
                console.log(`🔄 FETCHING NEXT PAGE: ${nextPage}`);
                fetchData(nextPage);
            }
        }
    }, [
        inView,
        loading,
        hasMore,
        pagination.page,
        pagination.totalPages,
        fetchData,
    ]);

    // Setup virtualizer with improved config
    const rowVirtualizer = useVirtualizer({
        count: posts.length + (hasMore ? 1 : 0), // +1 for loader row
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
                                                        : `post-${posts[virtualItem.index]?.id}-idx-${virtualItem.index}`
                                                }
                                                ref={
                                                    isLoaderRow
                                                        ? loadMoreRef
                                                        : null
                                                }
                                                className="absolute left-0 right-0 flex justify-center"
                                                style={{
                                                    top: 0,
                                                    height: `${virtualItem.size}px`,
                                                    transform: `translateY(${virtualItem.start}px)`,
                                                    // padding: '8px 0',
                                                }}
                                            >
                                                {/* {isValidating && !loading && (
                                                    <div className="absolute top-2 right-2 animate-pulse">
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/80 p-2 rounded-md">
                                                            <div className="size-2 rounded-full bg-primary animate-ping"></div>
                                                            Updating feed...
                                                        </div>
                                                    </div>
                                                )} */}
                                                {isLoaderRow &&
                                                posts.length > 0 ? (
                                                    <div
                                                        ref={loadMoreRef} // ONLY reference here, remove from parent div
                                                        className="py-6 w-full bg-red-100 dark:bg-red-900/30"
                                                        style={{
                                                            height: '100px', // Much smaller height to prevent triggering too early
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
