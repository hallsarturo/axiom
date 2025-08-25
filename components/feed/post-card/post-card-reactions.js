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

export function PostCardReactions({
    userReaction,
    reactionCounts,
    currentReactionIcon,
    handleReaction,
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <span>
                    <Button
                        variant="ghost"
                        className="text-primary dark:text-foreground"
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
                    onClick={() => handleReaction('like')}
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
                    onClick={() => handleReaction('dislike')}
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
                    onClick={() => handleReaction('laugh')}
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
                    onClick={() => handleReaction('anger')}
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
