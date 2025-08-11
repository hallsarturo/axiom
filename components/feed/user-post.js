import { PostCard } from '@/components/feed/post-card';

export function UserPost({ ...props }) {
    return <PostCard
            key={props.id}
            className="min-h-[500px]"
            postId={props.id}
            type="user"
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
            
        ></PostCard>;
}
