import { FeedComponent } from '@/components/feed/feed-component';
import { PublishPost } from '@/components/feed/publish-post';

export default function Feed() {
    return (
        <div className="flex flex-col min-h-screen justify-center items-center mt-6">
            <PublishPost className="w-2xl md:max-h-[800px] md:min-w-[680px] flex flex-col h-full"></PublishPost>
            <FeedComponent></FeedComponent>
        </div>
    );
}
