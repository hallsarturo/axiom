import { PostCard } from '@/components/feed/post-card';

export function PaperPost({ ...props }) {
    return (
        <PostCard
            cardTitle={props.title}
            imgSrc={null}
            description={props.description}
            author={props.author}
            createdAt={props.createdAt}
        ></PostCard>
    );
}
