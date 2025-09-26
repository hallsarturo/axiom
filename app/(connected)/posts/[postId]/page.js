'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { fetchSinglePost } from '@/lib/actions/client-actions';
import { UserPost } from '@/components/feed/user-post';
import { PaperPost } from '@/components/feed/paper-post';
import { SkeletonCard } from '@/components/skeletons/skeletonCard';
import {PostCardCommentsDialog} from '@/components/feed/post-card/post-card-comments-dialog'
import { toast } from 'sonner';

export default function PostDetailPage() {
    const { postId } = useParams();
    const searchParams = useSearchParams();
    const commentId = searchParams.get('commentId');
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentDialogOpen, setCommentDialogOpen] = useState(false);
    const commentRef = useRef(null);

    useEffect(() => {
        async function loadPost() {
            try {
                setLoading(true);
                const token =
                    process.env.NODE_ENV === 'development'
                        ? localStorage.getItem('token')
                        : null;

                const result = await fetchSinglePost(postId, token);

                if (result.success) {
                    setPost(result.data);
                } else {
                    setError('Failed to load post');
                    toast.error('Could not load the post');
                }
            } catch (err) {
                console.error('Error loading post:', err);
                setError('Something went wrong');
            } finally {
                setLoading(false);
            }
        }

        if (postId) {
            loadPost();
        }
    }, [postId]);

    useEffect(() => {
        if (commentId) {
            setCommentDialogOpen(true);
        }
    }, [commentId]);

    if (loading) {
        return (
            <div className="w-full flex justify-center mt-8">
                <SkeletonCard className="max-w-[700px] w-full" />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="w-full text-center py-12">
                <p className="text-red-500">{error || 'Post not found'}</p>
            </div>
        );
    }

    // Pass commentId to PostCardCommentsDialog
    return (
        <div className="w-full flex justify-center py-8">
            {post.type === 'user' ? (
                <UserPost {...post} />
            ) : (
                <PaperPost {...post} />
            )}
            <PostCardCommentsDialog
                post={post}
                commentDialogOpen={commentDialogOpen}
                setCommentDialogOpen={setCommentDialogOpen}
                scrollToCommentId={commentId}
            />
        </div>
    );
}
