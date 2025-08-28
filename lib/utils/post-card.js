import { BiLike, BiSolidLike, BiSolidDislike } from 'react-icons/bi';
import { FaLaughBeam, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { FaFaceAngry } from 'react-icons/fa6';

// avatar source selection
export function getAvatarSrc(
    type,
    avatarPic,
    magazineImg,
    agencyImg,
    normalizeImageUrl
) {
    if (type === 'user') return normalizeImageUrl(avatarPic);
    if (type === 'paper') return normalizeImageUrl(magazineImg);
    if (type === 'news') return normalizeImageUrl(agencyImg);
    return null;
}

// badge color selection
export function getBadgeColor(type) {
    if (type === 'paper') return 'bg-green-500';
    if (type === 'news') return 'bg-red-400';
    return 'bg-blue-500';
}

// description splitting
export function splitDescription(description, maxLength = 250) {
    if (!description) return ['', ''];
    if (description.length <= maxLength) return [description, ''];
    const splitIndex = description.lastIndexOf(' ', maxLength);
    if (splitIndex !== -1) {
        return [
            description.slice(0, splitIndex),
            description.slice(splitIndex + 1),
        ];
    }
    return [description.slice(0, maxLength), description.slice(maxLength)];
}

//  current reaction icon rendering
export function getCurrentReactionIcon(userReaction, reactionCounts) {
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
}

// Fetch Post
export const fetchPost = async (postId, token, userId) => {
    if (!postId) throw new Error('No postId provided');
    const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`
    );

    // Add userId as query parameter for development
    if (process.env.NODE_ENV === 'development' && userId) {
        console.log('fetchPost userId: ', userId);
        url.searchParams.append('userId', String(userId));
    }

    const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch: ${res.status} ${text}`);
    }
    return res.json();
};

// Get Bookmark current icon
export function getBookmarkIcon(isBookmarked) {
    return isBookmarked ? (
        <FaBookmark className="size-5.5" />
    ) : (
        <FaRegBookmark className="size-5.5" />
    );
}
