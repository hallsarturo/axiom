'use client';

import { SelectPostType } from '@/components/feed/select-post-type';
import { PaperPost } from '@/components/feed/paper-post';
import { Post } from '@/components/feed/post';
import { NewsPost } from '@/components/feed/news-post';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getPaperPosts } from '@/lib/actions/actions';
import { useEffect, useState } from 'react';

export function FeedComponent() {
    const [paperPostsProps, setPaperPostsProps] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const result = await getPaperPosts();
            if (result.success) {
                setPaperPostsProps(result.data.paperPosts);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="flex min-h-screen justify-center items-center mt-6">
            <div className="fixed top-1/3 left-20">
                <div className="flex flex-col justify-center">
                    <SelectPostType
                        defaultValue={undefined}
                        className="flex justify-center"
                    ></SelectPostType>
                </div>
            </div>
            <main className="">
                <div className="min-h-30 border-1 border-solid border-emerald-500">
                    <h1>make a post Form</h1>
                </div>

                <div className="flex flex-col max-h-screen mt-4 overflow-scroll gap-6">
                    {paperPostsProps ? (
                        paperPostsProps.map((post) => {
                            return (
                                <PaperPost
                                    key={post.id}
                                    title={post.title}
                                    description={post.description}
                                    author={post.author}
                                    createdAt={post.createdAt}
                                    totalReactions={post.totalReactions}
                                    comments={post.comments}
                                    shares={post.shares}
                                    likes={post.likes}
                                    dislikes={post.dislikes}
                                    angers={post.angers}
                                    laughs={post.laughs}

                                />
                            );
                        })
                    ) : (
                        <></>
                    )}

                    {/* <Post></Post>
                    <NewsPost></NewsPost> */}
                </div>
            </main>
        </div>
    );
}
