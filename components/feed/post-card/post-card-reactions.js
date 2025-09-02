import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { motion, AnimatePresence } from 'motion/react';
import { BiLike, BiSolidLike, BiDislike, BiSolidDislike } from 'react-icons/bi';
import { FaRegLaughBeam, FaLaughBeam } from 'react-icons/fa';
import { FaRegAngry } from 'react-icons/fa';
import { FaFaceAngry } from 'react-icons/fa6';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useReactionsStore } from '@/lib/state/reactionsStore';
import { useUser } from '@/components/context/UserProfileContext';

export function PostCardReactions({ postId }) {
    const requireAuth = useRequireAuth();
    const { user } = useUser();

    // Get reaction data from Zustand store
    const { getReactionData, handleReaction } = useReactionsStore();
    const { userReaction, reactionCounts } = getReactionData(postId);

    const token =
        process.env.NODE_ENV === 'development'
            ? typeof window !== 'undefined'
                ? localStorage.getItem('token')
                : null
            : null;

    // Generate current reaction icon
    const currentReactionIcon = (() => {
        switch (userReaction) {
            case 'like':
                return (
                    <div className="flex flex-row gap-2 align-middle">
                        <BiSolidLike className="size-5.5 text-primary dark:text-foreground" />
                        <span>{reactionCounts.likes} Likes</span>
                    </div>
                );
            case 'dislike':
                return (
                    <div className="flex flex-row gap-2 align-middle text-primary dark:text-foreground">
                        <BiSolidDislike className="size-5.5" />
                        <span>{reactionCounts.dislikes} Dislikes</span>
                    </div>
                );
            case 'laugh':
                return (
                    <div className="flex flex-row gap-2 align-middle text-primary dark:text-foreground">
                        <FaLaughBeam className="size-5.5" />
                        <span>{reactionCounts.laughs} Laughs</span>
                    </div>
                );
            case 'anger':
                return (
                    <div className="flex flex-row gap-2 align-middle text-primary dark:text-foreground">
                        <FaFaceAngry className="size-5.5" />
                        <span>{reactionCounts.angers} Anger</span>
                    </div>
                );
            default:
                return (
                    <div className="flex flex-row gap-2 align-middle">
                        <BiLike className="size-5.5" />
                        <span>{reactionCounts.likes} Likes</span>
                    </div>
                );
        }
    })();

    // Handle reaction directly with the store
    const handleReactionClick = (type) => {
        if (!requireAuth()) return;
        handleReaction(postId, type, user?.id, token);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <span>
                    <Button
                        variant="ghost"
                        className="text-primary dark:text-foreground"
                        onClick={(e) => {
                            if (!requireAuth()) {
                                e.preventDefault();
                                e.stopPropagation();
                                return;
                            }
                        }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={userReaction}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.25 }}
                                className="flex flex-row gap-2 align-middle"
                            >
                                {currentReactionIcon}
                            </motion.div>
                        </AnimatePresence>
                    </Button>
                </span>
            </PopoverTrigger>
            <PopoverContent className="w-full">
                <Button
                    onClick={() => handleReactionClick('like')}
                    className="text-xs"
                    variant="ghost"
                >
                    {userReaction === 'like' ? (
                        <div className="flex flex-row gap-2 align-middle text-primary dark:text-foreground">
                            <BiSolidLike className="text-primary dark:text-foreground" />
                            {reactionCounts.likes}
                        </div>
                    ) : (
                        <div className="flex flex-row gap-2 align-middle text-primary dark:text-foreground">
                            <BiLike className="text-primary dark:text-foreground" />
                            {reactionCounts.likes}
                        </div>
                    )}
                </Button>
                <Button
                    onClick={() => handleReactionClick('dislike')}
                    className="text-xs"
                    variant="ghost"
                >
                    {userReaction === 'dislike' ? (
                        <div className="flex flex-row gap-2 align-middle text-primary dark:text-foreground">
                            <BiSolidDislike className="text-primary dark:text-foreground" />
                            {reactionCounts.dislikes}
                        </div>
                    ) : (
                        <div className="flex flex-row gap-2 align-middle text-primary dark:text-foreground">
                            <BiDislike className="text-primary dark:text-foreground" />
                            {reactionCounts.dislikes}
                        </div>
                    )}
                </Button>
                <Button
                    onClick={() => handleReactionClick('laugh')}
                    className="text-xs"
                    variant="ghost"
                >
                    {userReaction === 'laugh' ? (
                        <div className="flex flex-row gap-2 align-middle text-primary dark:text-foreground">
                            <FaLaughBeam className="text-primary dark:text-foreground" />
                            {reactionCounts.laughs}
                        </div>
                    ) : (
                        <div className="flex flex-row gap-2 align-middle text-primary dark:text-foreground">
                            <FaRegLaughBeam className="text-primary dark:text-foreground" />
                            {reactionCounts.laughs}
                        </div>
                    )}
                </Button>
                <Button
                    onClick={() => handleReactionClick('anger')}
                    className="text-xs"
                    variant="ghost"
                >
                    {userReaction === 'anger' ? (
                        <div className="flex flex-row gap-2 align-middle text-primary dark:text-foreground">
                            <FaFaceAngry className="text-primary dark:text-foreground" />
                            {reactionCounts.angers}
                        </div>
                    ) : (
                        <div className="flex flex-row gap-2 align-middle text-primary dark:text-foreground">
                            <FaRegAngry className="text-primary dark:text-foreground" />
                            {reactionCounts.angers}
                        </div>
                    )}
                </Button>
            </PopoverContent>
        </Popover>
    );
}
