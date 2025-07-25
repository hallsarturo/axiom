import { PostCard } from '@/components/feed/post-card';

export function PaperPost({ ...props }) {
    return (
        <PostCard
            type="paper"
            cardTitle={props.title}
            imgSrc={null}
            description={props.description}
            author={props.author}
            createdAt={props.createdAt}
            totalReactions={props.totalReactions}
            comments={props.comments}
            shares={props.shares}
            likes={props.likes}
            dislikes={props.dislikes}
            angers={props.angers}
            laughs={props.laughs}
        ></PostCard>
    );
}
