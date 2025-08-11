import { Suspense } from 'react';
import { FeedComponent } from '@/components/feed/feed-component';
import { SkeletonCard } from '@/components/skeletons/skeletonCard';

export default function Feed() {
    return (
        <div className="flex flex-col w-full h-screen overflow-hidden mt-6">
            <Suspense
                fallback={<SkeletonCard className="max-w-[700px] w-full" />}
            >
                <FeedComponent />
            </Suspense>
        </div>
    );
}
