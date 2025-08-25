import { CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { PostCardReactions } from './post-card-reactions';

export function PostCardFooter({
    totalReactions,
    comments,
    shares,
    userReaction,
    reactionCounts,
    currentReactionIcon,
    handleReaction,
}) {
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
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6 text-primary dark:text-foreground"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                            />
                        </svg>
                        Coment
                    </Button>
                    <Button
                        variant="ghost"
                        className="text-primary dark:text-foreground"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6 text-primary dark:text-foreground"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                            />
                        </svg>
                    </Button>
                    <Button
                        variant="ghost"
                        className="text-primary dark:text-foreground flex-shrink-0"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6 text-primary dark:text-foreground"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                            />
                        </svg>
                        Share
                    </Button>
                </div>
            </div>
        </CardFooter>
    );
}
