import { PostCard } from '@/components/feed/post-card/post-card';

export function PaperPost({ mutateFeed, refreshFeed, ...props }) {
    return (
        <PostCard
            key={props.id}
            postId={props.id}
            type="paper"
            identifier={props.identifier}
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
            mutateFeed={mutateFeed}
            refreshFeed={refreshFeed}
        ></PostCard>
    );
}
