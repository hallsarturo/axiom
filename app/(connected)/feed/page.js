import { Suspense } from 'react';
import { FeedComponent } from '@/components/feed/feed-component';
import { SelectPostType } from '@/components/feed/select-post-type';
import { PublishPost } from '@/components/feed/publish-post';
import { SkeletonCard } from '@/components/skeletons/skeletonCard';

export default function Feed() {
    return (
        <div className="flex flex-col h-screen overflow-hidden items-center">
            <Suspense fallback={<SkeletonCard />}>
                <PublishPost className="w-2xl md:max-h-[800px] md:min-w-[680px] flex flex-col h-full" />
            </Suspense>
            <Suspense fallback={<SkeletonCard />}>
                <FeedComponent />
            </Suspense>
        </div>
    );
}
