import { PostCard } from '@/components/feed/post-card';

export function PaperPost({ ...props }) {
    return (
        <PostCard
            cardTitle={props.title}
            imgSrc={null}
            description={props.description}
            author={props.author}
            createdAt={props.createdAt}
            totalReactions={props.totalReactions}
            comments={props.comments}
            shares={props.shares}
        ></PostCard>
    );
}
