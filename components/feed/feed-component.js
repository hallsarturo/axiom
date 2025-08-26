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
import InfiniteScroll from 'react-infinite-scroll-component';
import { SkeletonCard } from '@/components/skeletons/skeletonCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { usePostType } from '@/components/context/post-type-provider';

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
    const { postType, setPostType } = usePostType(); // 'all', 'papers', 'userPosts', 'news'
    const [pendingRefresh, setPendingRefresh] = useState(false);

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

    function handlePostPublished(newPost) {
        toast.success('Post published!');
        setPosts((prev) => [newPost, ...prev]);
        mutate();
        setPendingRefresh(true); // Set flag to trigger delayed refresh
    }

    useEffect(() => {
        if (pendingRefresh) {
            const timer = setTimeout(() => {
                // Reset feed state before loading
                setPosts([]);
                setPagination({
                    page: 1,
                    pageSize: PAGE_SIZE,
                    totalPages: 1,
                    total: 0,
                });
                setHasMore(true);
                setError(null);
                loadMoreItems(0, PAGE_SIZE - 1);
                setPendingRefresh(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [pendingRefresh, loadMoreItems]);

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

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex w-full justify-center">
                <PublishPost
                    mutateFeed={handlePostPublished}
                    onDialogOpenChange={handleDialogOpen}
                />
            </div>
            <div
                id="scrollableDiv"
                style={{
                    height: '80vh', // More responsive than fixed px
                    overflow: 'auto',
                }}
                className="flex justify-center items-start pt-0 w-full"
            >
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
                {/* Infinite scroll container */}
                {posts.length > 0 && (
                    <InfiniteScroll
                        dataLength={posts.length}
                        next={() =>
                            loadMoreItems(
                                posts.length,
                                posts.length + PAGE_SIZE - 1
                            )
                        }
                        hasMore={hasMore}
                        loader={
                            <div className="w-full flex justify-center">
                                <SkeletonCard />
                            </div>
                        }
                        endMessage={
                            <p
                                style={{
                                    textAlign: 'center',
                                    margin: '2rem 0',
                                }}
                            >
                                <b>No more posts</b>
                            </p>
                        }
                        scrollableTarget="scrollableDiv"
                        className="w-full flex flex-col gap-2"
                    >
                        {posts.map((post, index) => (
                            <div
                                key={post.id ? `${post.id}-${index}` : index}
                                className="w-full flex justify-center"
                            >
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
                        ))}
                    </InfiniteScroll>
                )}
            </div>
        </div>
    );
}
