import { PostCard } from '@/components/feed/post-card/post-card';
import { normalizeImageUrl } from '@/lib/utils/image';

export function UserPost({ mutateFeed, refreshFeed, ...props }) {
    return (
        <PostCard
            key={props.id}
            className="min-h-[380px]"
            userId={props.userId}
            postId={props.id}
            avatarPic={normalizeImageUrl(props.authorProfilePic)}
            type="user"
            cardTitle={props.title}
            imgSrc={normalizeImageUrl(props.imgSrc)}
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
            isBookmarked={props.isBookmarked}
            totalBookmarks={props.totalBookmarks}
            currentReactionIcon={props.currentReactionIcon}
        ></PostCard>
    );
}
