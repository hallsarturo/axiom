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
    commentId,
    type = 'post',
    commentDialogOpen = false,
    // two separate size props: trigger (small) and content (larger or different)
    triggerIconSizeClass = 'size-5.5',
    contentIconSizeClass = 'size-4.5',
    // allow caller to set the trigger button variant (default 'ghost')
    triggerButtonVariant = 'ghost',
    // control trigger button classes (text color / bg / extra)
    triggerTextClass = 'text-primary dark:text-foreground',
    triggerClassName = '',
    hover = 'enabled', // new prop: 'enabled' (default) or 'disabled'
}) {
    // Add state for popover open
    const [popoverOpen, setPopoverOpen] = useState(false);
    const requireAuth = useRequireAuth();
    const { user } = useUser();

    // Get reaction data from Zustand store
    const { getReactionData, handlePostReaction, handleCommentReaction } =
        useReactionsStore();

    // Use correct id and handler
    const id = type === 'comment' ? commentId : postId;
    const { userReaction, reactionCounts } = getReactionData(id, type);

    // prefer a single final text class so we never render conflicting utilities
    const finalTriggerTextClass =
        triggerTextClass || 'text-primary dark:text-foreground';

    // separate size-only classes and color handled by wrapper (so SVG uses currentColor)
    const triggerIconSizeOnly = triggerIconSizeClass;
    const contentIconSizeOnly = contentIconSizeClass;

    // Conditionally add hover classes
    const hoverClasses =
        hover === 'disabled' ? '' : 'group-hover:text-white transition-colors';

    const iconWrapperColorClass = `${finalTriggerTextClass} ${hoverClasses}`;
    const contentIconWrapperColorClass = `text-primary dark:text-foreground ${hoverClasses}`;
    const textWrapperColorClass = `${finalTriggerTextClass} ${hoverClasses}`;

    // Generate current reaction icon
    const currentReactionIcon = (() => {
        switch (userReaction) {
            case 'like':
                return (
                    <div className="flex flex-row gap-2 items-center">
                        <span className={iconWrapperColorClass}>
                            <BiSolidLike
                                fill="currentColor"
                                className={triggerIconSizeOnly}
                            />
                        </span>
                        <span className={textWrapperColorClass}>
                            {reactionCounts.likes} Likes
                        </span>
                    </div>
                );
            case 'dislike':
                return (
                    <div className="flex flex-row gap-2 items-center">
                        <span className={iconWrapperColorClass}>
                            <BiSolidDislike
                                fill="currentColor"
                                className={triggerIconSizeOnly}
                            />
                        </span>
                        <span className={textWrapperColorClass}>
                            {reactionCounts.dislikes} Dislikes
                        </span>
                    </div>
                );
            case 'laugh':
                return (
                    <div className="flex flex-row gap-2 items-center">
                        <span className={iconWrapperColorClass}>
                            <FaLaughBeam
                                fill="currentColor"
                                className={triggerIconSizeOnly}
                            />
                        </span>
                        <span className={textWrapperColorClass}>
                            {reactionCounts.laughs} Laughs
                        </span>
                    </div>
                );
            case 'anger':
                return (
                    <div className="flex flex-row gap-2 items-center">
                        <span className={iconWrapperColorClass}>
                            <FaFaceAngry
                                fill="currentColor"
                                className={triggerIconSizeOnly}
                            />
                        </span>
                        <span className={textWrapperColorClass}>
                            {reactionCounts.angers} Anger
                        </span>
                    </div>
                );
            default:
                return (
                    <div className="flex flex-row gap-2 items-center">
                        <BiLike className={triggerIconSizeOnly} />
                        <span className={finalTriggerTextClass}>
                            {reactionCounts.likes} Likes
                        </span>
                    </div>
                );
        }
    })();

    const token =
        process.env.NODE_ENV === 'development'
            ? typeof window !== 'undefined'
                ? localStorage.getItem('token')
                : null
            : null;

    // Handle reaction directly with the store
    const handleReactionClick = (e, reactionType) => {
        e.preventDefault();
        e.stopPropagation();

        if (!requireAuth()) return;
        if (type === 'comment') {
            handleCommentReaction(commentId, reactionType, user?.id, token);
        } else {
            handlePostReaction(postId, reactionType, user?.id, token);
        }
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
                        // make this a group so children can use group-hover
                        className={`group ${triggerClassName} ${finalTriggerTextClass} ${commentDialogOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleTriggerClick}
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
                    className="text-xs group"
                    variant="ghost"
                >
                    {userReaction === 'like' ? (
                        <div className="flex flex-row gap-2 align-middle">
                            <span className={contentIconWrapperColorClass}>
                                <BiSolidLike
                                    fill="currentColor"
                                    className={contentIconSizeOnly}
                                />
                            </span>
                            <span
                                className={`${finalTriggerTextClass} group-hover:text-white transition-colors ml-2`}
                            >
                                {reactionCounts.likes}
                            </span>
                        </div>
                    ) : (
                        <div className="flex flex-row gap-2 align-middle">
                            <span className={contentIconWrapperColorClass}>
                                <BiLike
                                    fill="currentColor"
                                    className={contentIconSizeOnly}
                                />
                            </span>
                            <span
                                className={`${finalTriggerTextClass} group-hover:text-white transition-colors ml-2`}
                            >
                                {reactionCounts.likes}
                            </span>
                        </div>
                    )}
                </Button>
                <Button
                    onClick={(e) => handleReactionClick(e, 'dislike')}
                    className="text-xs group"
                    variant="ghost"
                >
                    {userReaction === 'dislike' ? (
                        <div className="flex flex-row gap-2 align-middle">
                            <span className={contentIconWrapperColorClass}>
                                <BiSolidDislike
                                    fill="currentColor"
                                    className={contentIconSizeOnly}
                                />
                            </span>
                            <span
                                className={`${finalTriggerTextClass} group-hover:text-white transition-colors ml-2`}
                            >
                                {reactionCounts.dislikes}
                            </span>
                        </div>
                    ) : (
                        <div className="flex flex-row gap-2 align-middle">
                            <span className={contentIconWrapperColorClass}>
                                <BiDislike
                                    fill="currentColor"
                                    className={contentIconSizeOnly}
                                />
                            </span>
                            <span
                                className={`${finalTriggerTextClass} group-hover:text-white transition-colors ml-2`}
                            >
                                {reactionCounts.dislikes}
                            </span>
                        </div>
                    )}
                </Button>
                <Button
                    onClick={(e) => handleReactionClick(e, 'laugh')}
                    className="text-xs group"
                    variant="ghost"
                >
                    {userReaction === 'laugh' ? (
                        <div className="flex flex-row gap-2 align-middle">
                            <span className={contentIconWrapperColorClass}>
                                <FaLaughBeam
                                    fill="currentColor"
                                    className={contentIconSizeOnly}
                                />
                            </span>
                            <span
                                className={`${finalTriggerTextClass} group-hover:text-white transition-colors ml-2`}
                            >
                                {reactionCounts.laughs}
                            </span>
                        </div>
                    ) : (
                        <div className="flex flex-row gap-2 align-middle">
                            <span className={contentIconWrapperColorClass}>
                                <FaRegLaughBeam
                                    fill="currentColor"
                                    className={contentIconSizeOnly}
                                />
                            </span>
                            <span
                                className={`${finalTriggerTextClass} group-hover:text-white transition-colors ml-2`}
                            >
                                {reactionCounts.laughs}
                            </span>
                        </div>
                    )}
                </Button>
                <Button
                    onClick={(e) => handleReactionClick(e, 'anger')}
                    className="text-xs group"
                    variant="ghost"
                >
                    {userReaction === 'anger' ? (
                        <div className="flex flex-row gap-2 align-middle">
                            <span className={contentIconWrapperColorClass}>
                                <FaFaceAngry
                                    fill="currentColor"
                                    className={contentIconSizeOnly}
                                />
                            </span>
                            <span
                                className={`${finalTriggerTextClass} group-hover:text-white transition-colors ml-2`}
                            >
                                {reactionCounts.angers}
                            </span>
                        </div>
                    ) : (
                        <div className="flex flex-row gap-2 align-middle">
                            <span className={contentIconWrapperColorClass}>
                                <FaRegAngry
                                    fill="currentColor"
                                    className={contentIconSizeOnly}
                                />
                            </span>
                            <span
                                className={`${finalTriggerTextClass} group-hover:text-white transition-colors ml-2`}
                            >
                                {reactionCounts.angers}
                            </span>
                        </div>
                    )}
                </Button>
            </PopoverContent>
        </Popover>
    );
}
