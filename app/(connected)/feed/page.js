import { SelectPostType } from '@/components/feed/select-post-type';
import { PaperPost } from '@/components/feed/paper-post';
import { Post } from '@/components/feed/post';
import { NewsPost } from '@/components/feed/news-post';

export default function Feed() {
    return (
        <div className="flex min-h-screen justify-center items-center mt-6">
            <div className="fixed top-1/3 left-20">
                <div className="flex flex-col justify-center">
                    <SelectPostType defaultValue={undefined} className="flex justify-center"></SelectPostType>
                </div>
            </div>
            <main className="">
                <div className="flex flex-col max-h-screen mt-4 overflow-scroll gap-6">
                    <PaperPost></PaperPost>
                    <PaperPost></PaperPost>
                    <Post></Post>
                    <NewsPost></NewsPost>
                </div>
            </main>
        </div>
    );
}
