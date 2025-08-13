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
import { useCallback, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import InfiniteLoader from 'react-window-infinite-loader';
import { FixedSizeList as List } from 'react-window';
import { SkeletonCard } from '@/components/skeletons/skeletonCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

// 1. Create a better combined pagination tracker for 'all' post type
const fetchFeed = async (postType, token, page, pageSize, timestamp) => {
    if (postType === 'papers') {
        return getPaperPosts(token, page, pageSize, timestamp);
    }
    if (postType === 'userPosts') {
        return getUserPosts(token, page, pageSize, timestamp);
    }
    if (postType === 'news') {
        return getNewsPosts(token, page, pageSize, timestamp);
    }

    // For 'all' type, combine both
    if (postType === 'all') {
        const [papers, userPosts] = await Promise.all([
            getPaperPosts(token, page, pageSize, timestamp),
            getUserPosts(token, page, pageSize, timestamp),
        ]);
        return {
            success: true,
            data: {
                posts: [
                    ...papers.data.paperPosts,
                    ...userPosts.data.userPosts,
                ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
                pagination: {
                    page,
                    pageSize,
                    totalPages: Math.max(
                        papers.data.pagination?.totalPages ?? page,
                        userPosts.data.pagination?.totalPages ?? page
                    ),
                    total:
                        (papers.data.paperPosts?.length ?? 0) +
                        (userPosts.data.userPosts?.length ?? 0),
                },
            },
        };
    }
};

export function FeedComponent() {
    const [posts, setPosts] = useState([]); // unified feed
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: PAGE_SIZE, // Smaller page size for faster loading
        totalPages: 1,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const [postType, setPostType] = useState('papers'); // 'all', 'papers', 'userPosts', 'news'

    // Callback to set postType when dialog opens
    const handleDialogOpen = (open) => {
        if (open) {
            if (postType !== 'userPosts') {
                toast.info('Switched to user posts mode');
                setPostType('userPosts');
            }
        }
    };
    const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // SWR for instant post publication
    const { mutate } = useSWR(
        ['feed', postType, token],
        () => fetchFeed(postType, token, 1, PAGE_SIZE),
        { refreshInterval: 0 }
    );

    // Load more posts
    const loadMoreItems = useCallback(
        async (startIndex, stopIndex) => {
            if (loading || !hasMore) return;
            setLoading(true);
            try {
                // Preload up to 3 pages at once
                const requests = [];
                for (
                    let page = Math.floor(startIndex / PAGE_SIZE) + 1;
                    page <= Math.floor(stopIndex / PAGE_SIZE) + 1;
                    page++
                ) {
                    requests.push(fetchFeed(postType, token, page, PAGE_SIZE));
                }
                const results = await Promise.all(requests);
                let allNewPosts = [];
                let lastPagination = pagination;
                results.forEach((result) => {
                    if (result.success) {
                        const newPosts =
                            postType === 'papers'
                                ? result.data.paperPosts
                                : postType === 'userPosts'
                                  ? result.data.userPosts
                                  : postType === 'news'
                                    ? []
                                    : result.data.posts;
                        allNewPosts = [...allNewPosts, ...newPosts];
                        lastPagination = result.data.pagination;
                    }
                });
                setPosts((prev) => {
                    const existingIds = new Set(prev.map((p) => p.id));
                    return [
                        ...prev,
                        ...allNewPosts.filter((p) => !existingIds.has(p.id)),
                    ];
                });
                setPagination((prev) => ({
                    ...prev,
                    ...lastPagination,
                }));
                setHasMore(
                    lastPagination.page <
                        (lastPagination.totalPages ?? lastPagination.page) &&
                        allNewPosts.length > 0
                );
            } catch (err) {
                setError('Network error');
                setHasMore(true); // Allow retry
            }
            setLoading(false);
        },
        [loading, hasMore, postType, token, pagination]
    );

    // InfiniteLoader config
    const isItemLoaded = (index) => index < posts.length;

    // Reset feed on postType change (do NOT call loadMoreItems here)
    useEffect(() => {
        setPosts([]);
        setPagination({
            page: 1,
            pageSize: PAGE_SIZE,
            totalPages: 1,
            total: 0,
        });
        setHasMore(true);
        setError(null);
    }, [postType, token]);

    // Initial load after reset
    useEffect(() => {
        if (posts.length === 0 && hasMore && !loading && !error) {
            loadMoreItems(0, PAGE_SIZE - 1);
        }
        // Only depend on posts.length, hasMore, loading, error, loadMoreItems
    }, [posts.length, hasMore, loading, error, loadMoreItems]);

    // Handle instant post publication
    function handlePostPublished(newPost) {
        toast.success('Post published!');
        setPosts((prev) => [newPost, ...prev]);
        mutate();
    }

    function handleFeedRefresh() {
        // Reset local posts and pagination, then re-fetch
        setPosts([]);
        setPagination({
            page: 1,
            pageSize: PAGE_SIZE,
            totalPages: 1,
            total: 0,
        });
        setHasMore(true);
        setError(null);
        mutate(); // SWR re-fetch
        // Optionally, trigger initial load
        loadMoreItems(0, PAGE_SIZE - 1);
    }

    // Render each row
    const Row = ({ index, style }) => {
        if (!isItemLoaded(index)) {
            return (
                <div style={style} className="flex justify-center items-center">
                    <SkeletonCard className="max-w-[700px] w-full" />
                </div>
            );
        }
        const post = posts[index];
        return (
            <div style={style} className="flex flex-col gap-2">
                {post.type === 'paper' && (
                    <PaperPost
                        {...post}
                        mutateFeed={handleFeedRefresh}
                        refreshFeed={loadMoreItems}
                    />
                )}
                {post.type === 'user' && (
                    <UserPost
                        {...post}
                        mutateFeed={handleFeedRefresh}
                        refreshFeed={loadMoreItems}
                    />
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col justify-center">
            <div className="flex w-full justify-center">
                <PublishPost
                    mutateFeed={handlePostPublished}
                    onDialogOpenChange={handleDialogOpen}
                />
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
                                    loadMoreItems(0, PAGE_SIZE - 1);
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
                    <InfiniteLoader
                        isItemLoaded={isItemLoaded}
                        itemCount={
                            hasMore ? posts.length + PAGE_SIZE : posts.length
                        }
                        loadMoreItems={loadMoreItems}
                    >
                        {({ onItemsRendered, ref }) => (
                            <List
                                height={window.innerHeight - 150}
                                itemCount={
                                    hasMore
                                        ? posts.length + PAGE_SIZE
                                        : posts.length
                                }
                                itemSize={425}
                                width={'100%'}
                                onItemsRendered={onItemsRendered}
                                ref={ref}
                            >
                                {Row}
                            </List>
                        )}
                    </InfiniteLoader>
                )}
            </div>
        </div>
    );
}
