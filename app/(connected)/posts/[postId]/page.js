'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchSinglePost } from '@/lib/actions/actions';
import { UserPost } from '@/components/feed/user-post';
import { PaperPost } from '@/components/feed/paper-post';
import { SkeletonCard } from '@/components/skeletons/skeletonCard';
import { toast } from 'sonner';

export default function PostDetailPage() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    return (
        <div className="w-full flex justify-center py-8">
            {post.type === 'user' ? (
                <UserPost {...post} />
            ) : (
                <PaperPost {...post} />
            )}
        </div>
    );
}
