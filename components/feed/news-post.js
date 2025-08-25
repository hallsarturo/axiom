import { PostCard } from '@/components/feed/post-card/post-card';

export function NewsPost({ ...props }) {
    return <PostCard cardTitle="News Post" imgSrc="/feed/news.jpg"></PostCard>;
}
