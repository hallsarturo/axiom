import { Suspense } from 'react';
import { FeedComponent } from '@/components/feed/feed-component';
import { SelectPostType } from '@/components/feed/select-post-type';
import { PublishPost } from '@/components/feed/publish-post';
import { SkeletonCard } from '@/components/skeletons/skeletonCard';

export default function Feed() {
    return (
        <div className="flex flex-col w-full h-screen overflow-hidden mt-6">
            <Suspense
                fallback={
                    <div className="flex justify-center w-full">
                        <SkeletonCard className="max-w-[700px] w-full" />
                    </div>
                }
            >
                <div className="flex justify-center w-full">
                    <PublishPost className="max-w-[700px] w-full mx-auto flex flex-col" />
                </div>
            </Suspense>

            <Suspense fallback={<SkeletonCard />}>
                <FeedComponent />
            </Suspense>
        </div>
    );
}
