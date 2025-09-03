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
import { useEffect, useState } from 'react';

export function PostCardReactions({
    postId,
    commentDialogOpen = false,
    // two separate size props: trigger (small) and content (larger or different)
    triggerIconSizeClass = 'size-5.5',
    contentIconSizeClass = 'size-4.5',
    // allow caller to set the trigger button variant (default 'ghost')
    triggerButtonVariant = 'ghost',
    // control trigger button classes (text color / bg / extra)
    triggerTextClass = 'text-primary dark:text-foreground',
    triggerClassName = '',
}) {
    // Add state for popover open
    const [popoverOpen, setPopoverOpen] = useState(false);
    const requireAuth = useRequireAuth();
    const { user } = useUser();

    // Get reaction data from Zustand store
    const { getReactionData, handleReaction } = useReactionsStore();
    const { userReaction, reactionCounts } = getReactionData(postId);

    // prefer a single final text class so we never render conflicting utilities
    const finalTriggerTextClass =
        triggerTextClass || 'text-primary dark:text-foreground';

    const triggerIconClass = `${triggerIconSizeClass} ${finalTriggerTextClass}`;
    const contentIconClass = `${contentIconSizeClass} text-primary dark:text-foreground`;

    // Generate current reaction icon
    const currentReactionIcon = (() => {
        switch (userReaction) {
            case 'like':
                return (
                    <div className="flex flex-row gap-2 items-center">
                        <BiSolidLike className={triggerIconClass} />
                        <span>{reactionCounts.likes} Likes</span>
                    </div>
                );
            case 'dislike':
                return (
                    <div className="flex flex-row gap-2 items-center text-primary dark:text-foreground">
                        <BiSolidDislike className={triggerIconClass} />
                        <span>{reactionCounts.dislikes} Dislikes</span>
                    </div>
                );
            case 'laugh':
                return (
                    <div className="flex flex-row gap-2 items-center text-primary dark:text-foreground">
                        <FaLaughBeam className={triggerIconClass} />
                        <span>{reactionCounts.laughs} Laughs</span>
                    </div>
                );
            case 'anger':
                return (
                    <div className="flex flex-row gap-2 items-center text-primary dark:text-foreground">
                        <FaFaceAngry className={triggerIconClass} />
                        <span>{reactionCounts.angers} Anger</span>
                    </div>
                );
            default:
                return (
                    <div className="flex flex-row gap-2 items-center">
                        <BiLike className={triggerIconClass} />
                        <span>{reactionCounts.likes} Likes</span>
                    </div>
                );
        }
    })();

    // Handle reaction directly with the store
    const handleReactionClick = (e, type) => {
        e.preventDefault();
        e.stopPropagation();

        if (!requireAuth()) return;
        handleReaction(postId, type, user?.id, token);
    };

    // If dialogOpen changes to true, close the popover
    useEffect(() => {
        if (commentDialogOpen) {
            setPopoverOpen(false);
        }
    }, [commentDialogOpen]);

    // This function handles the trigger click
    const handleTriggerClick = (e) => {
        if (commentDialogOpen) {
            // If dialog is open, prevent the default behavior and stop propagation
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        if (!requireAuth()) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        // Toggle the popover state manually
        setPopoverOpen((prev) => !prev);
    };

    return (
        <Popover
            open={popoverOpen}
            onOpenChange={(open) => {
                // Only allow opening if dialog is not open
                if (!commentDialogOpen) {
                    setPopoverOpen(open);
                }
            }}
            modal={true}
        >
            {/* Wrap PopoverTrigger in a div to intercept events before they reach the trigger */}
            <div
                onClick={(e) => {
                    if (commentDialogOpen) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }}
            >
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant={triggerButtonVariant}
                        className={`${triggerClassName} ${triggerTextClass} ${commentDialogOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleTriggerClick}
                        // Important: disable the button when dialog is open
                        disabled={commentDialogOpen}
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
                </PopoverTrigger>
            </div>
            <PopoverContent className="w-full" style={{ zIndex: 60 }}>
                <Button
                    onClick={(e) => handleReactionClick(e, 'like')}
                    className="text-xs"
                    variant="ghost"
                >
                    {userReaction === 'like' ? (
                        <div className="flex flex-row gap-2 align-middle text-primary dark:text-foreground">
                            <BiSolidLike className={contentIconClass} />
                            {reactionCounts.likes}
                        </div>
                    ) : (
                        <div className="flex flex-row gap-2 align-middle text-primary dark:text-foreground">
                            <BiLike className={contentIconClass} />
                            {reactionCounts.likes}
                        </div>
                    )}
                </Button>
                <Button
                    onClick={(e) => handleReactionClick(e, 'dislike')}
                    className="text-xs"
                    variant="ghost"
                >
                    {userReaction === 'dislike' ? (
                        <div className="flex flex-row gap-2 align-middle text-primary dark:text-foreground">
                            <BiSolidDislike className={contentIconClass} />
                            {reactionCounts.dislikes}
                        </div>
                    ) : (
                        <div className="flex flex-row gap-2 align-middle text-primary dark:text-foreground">
                            <BiDislike className={contentIconClass} />
                            {reactionCounts.dislikes}
                        </div>
                    )}
                </Button>
                <Button
                    onClick={(e) => handleReactionClick(e, 'laugh')}
                    className="text-xs"
                    variant="ghost"
                >
                    {userReaction === 'laugh' ? (
                        <div className="flex flex-row gap-2 align-middle text-primary dark:text-foreground">
                            <FaLaughBeam className={contentIconClass} />
                            {reactionCounts.laughs}
                        </div>
                    ) : (
                        <div className="flex flex-row gap-2 align-middle text-primary dark:text-foreground">
                            <FaRegLaughBeam className={contentIconClass} />
                            {reactionCounts.laughs}
                        </div>
                    )}
                </Button>
                <Button
                    onClick={(e) => handleReactionClick(e, 'anger')}
                    className="text-xs"
                    variant="ghost"
                >
                    {userReaction === 'anger' ? (
                        <div className="flex flex-row gap-2 align-middle text-primary dark:text-foreground">
                            <FaFaceAngry className={contentIconClass} />
                            {reactionCounts.angers}
                        </div>
                    ) : (
                        <div className="flex flex-row gap-2 align-middle text-primary dark:text-foreground">
                            <FaRegAngry className={contentIconClass} />
                            {reactionCounts.angers}
                        </div>
                    )}
                </Button>
            </PopoverContent>
        </Popover>
    );
}
