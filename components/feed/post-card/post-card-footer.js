import { CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { PostCardReactions } from './post-card-reactions';
import { FaRegComment, FaRegBookmark } from 'react-icons/fa';
import { IoShareSocialOutline } from 'react-icons/io5';
import { toast } from 'sonner';
import { putBookmarkByPostId } from '@/lib/actions/actions';

export function PostCardFooter({
    totalReactions,
    comments,
    shares,
    userReaction,
    reactionCounts,
    currentReactionIcon,
    handleReaction,
    postId,
    userId,
}) {
    const handleBookmark = async (userId, postId) => {
        let token = null;
        if (
            process.env.NODE_ENV === 'development' &&
            typeof window !== 'undefined'
        ) {
            token = localStorage.getItem('token');
        }
        const res = await putBookmarkByPostId(token, userId, postId);
        if (res.status === 200) {
            toast.success('bookmark removed');
        } else if (res.status === 201) {
            toast.success('Post bookmarked');
        } else if (res.status === 500) {
            toast.error('Could not bookmark post');
        }
    };

    return (
        <CardFooter className="justify-center">
            <div className="flex flex-col w-full gap-1.5">
                <div className="flex flex-row w-full justify-between text-sm flex-wrap">
                    <p>reactions {totalReactions}</p>
                    <p>comments {comments}</p>
                    <p>shares {shares}</p>
                </div>
                <Separator />
                <div className="flex flex-row justify-around flex-wrap">
                    <PostCardReactions
                        userReaction={userReaction}
                        reactionCounts={reactionCounts}
                        currentReactionIcon={currentReactionIcon}
                        handleReaction={handleReaction}
                    />
                    <Button
                        variant="ghost"
                        className="text-primary dark:text-foreground"
                    >
                        <FaRegComment className="size-5.5" />
                        Comment
                    </Button>
                    <Button
                        variant="ghost"
                        className="text-primary dark:text-foreground"
                        onClick={() => {
                            handleBookmark(userId, postId);
                        }}
                    >
                        <FaRegBookmark className="size-5.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        className="text-primary dark:text-foreground flex-shrink-0"
                    >
                        <IoShareSocialOutline className="size-5.5" />
                        Share
                    </Button>
                </div>
            </div>
        </CardFooter>
    );
}
