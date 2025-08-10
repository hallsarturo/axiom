'use client';

import { SelectPostType } from '@/components/feed/select-post-type';
import { PaperPost } from '@/components/feed/paper-post';
import { getPaperPosts } from '@/lib/actions/actions';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useInView } from 'react-intersection-observer';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { SkeletonCard } from '@/components/skeletons/skeletonCard';

export function FeedComponent() {
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10, // Smaller page size for faster loading
        totalPages: 1,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const [postType, setPostType] = useState('posts'); // 'all', 'papers', 'posts', 'news'

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
            } else if (postType === 'news') {
                result = await getNewsPosts(token, page, pagination.pageSize);
            } else if (postType === 'all') {
                const [papers, posts, news] = await Promise.all([
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
                            ...posts.data.userPosts,
                            ...news.data.newsPosts,
                        ].sort(
                            (a, b) =>
                                new Date(b.createdAt) - new Date(a.createdAt)
                        ),
                    },
                };
            }

            if (result.success) {
                console.log(
                    `Loaded ${result.data.paperPosts.length} posts from page ${page}`
                );

                // Deduplicate posts when appending
                if (page === 1) {
                    setPosts(result.data.paperPosts);
                } else {
                    setPosts((prev) => {
                        // Create a Map with post ID as key to deduplicate
                        const newPosts = [...prev];
                        const existingIds = new Set(
                            newPosts.map((post) => post.id)
                        );

                        // Only add posts that don't exist yet
                        result.data.paperPosts.forEach((post) => {
                            if (!existingIds.has(post.id)) {
                                newPosts.push(post);
                                existingIds.add(post.id);
                            }
                        });

                        return newPosts;
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
        estimateSize: () => 450, // Adjusted for your card size
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
            {error && (
                <div className="w-full flex flex-col justify-center items-center text-center text-red-500 py-4 gap-4">
                    <SkeletonCard />
                    <span>{error}</span>
                    <Button
                        onClick={() => {
                            setError(null);
                            fetchData(1);
                        }}
                        className=""
                    >
                        Retry
                    </Button>
                </div>
            )}

            {/* Empty state */}
            {posts.length === 0 && !loading && !error && (
                <div className="w-full text-center py-8">No posts found</div>
            )}

            {/* Initial loading state */}
            {loading && posts.length === 0 && (
                <div className="w-full text-center py-8">Loading posts...</div>
            )}

            {/* Virtualized posts container - FIXED STYLING */}
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
                        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                            const isLoaderRow =
                                virtualItem.index >= posts.length;

                            return (
                                <div
                                    key={
                                        isLoaderRow
                                            ? 'loader'
                                            : `post-${posts[virtualItem.index]?.id}-idx-${virtualItem.index}`
                                    }
                                    ref={isLoaderRow ? loadMoreRef : null}
                                    className="absolute left-0 right-0 flex justify-center"
                                    style={{
                                        top: 0,
                                        height: `${virtualItem.size}px`,
                                        transform: `translateY(${virtualItem.start}px)`,
                                        padding: '8px 0',
                                    }}
                                >
                                    {isLoaderRow ? (
                                        hasMore ? (
                                            <div className="flex flex-col justify-center items-center g-4 py-4 text-center">
                                                <SkeletonCard />
                                                <p>Loading more posts...</p>
                                            </div>
                                        ) : (
                                            <div className="py-4 text-center w-full">
                                                No more posts to load
                                            </div>
                                        )
                                    ) : (
                                        <PaperPost
                                            postId={posts[virtualItem.index].id}
                                            identifier={
                                                posts[virtualItem.index]
                                                    .identifier
                                            }
                                            title={
                                                posts[virtualItem.index].title
                                            }
                                            description={
                                                posts[virtualItem.index]
                                                    .description
                                            }
                                            author={
                                                posts[virtualItem.index].author
                                            }
                                            createdAt={
                                                posts[virtualItem.index]
                                                    .createdAt
                                            }
                                            totalReactions={
                                                posts[virtualItem.index]
                                                    .totalReactions
                                            }
                                            comments={
                                                posts[virtualItem.index]
                                                    .comments
                                            }
                                            shares={
                                                posts[virtualItem.index].shares
                                            }
                                            likes={
                                                posts[virtualItem.index].likes
                                            }
                                            dislikes={
                                                posts[virtualItem.index]
                                                    .dislikes
                                            }
                                            angers={
                                                posts[virtualItem.index].angers
                                            }
                                            laughs={
                                                posts[virtualItem.index].laughs
                                            }
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <ScrollBar orientation="vertical" />
            </ScrollArea>
        </div>
    );
}
