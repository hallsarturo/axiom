import { FeedComponent } from '@/components/feed/feed-component';
import { SelectPostType } from '@/components/feed/select-post-type';
import { PublishPost } from '@/components/feed/publish-post';

export default function Feed() {
    return (
        <div className="flex flex-col h-screen overflow-hidden items-center">
            
            <PublishPost className="w-2xl md:max-h-[800px] md:min-w-[680px] flex flex-col h-full" />
            <FeedComponent />
        </div>
    );
}
