'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { usePostType } from '@/components/context/post-type-provider';

export function SelectPostType({ defaultValue, className }) {
    const { postType, setPostType } = usePostType();
    return (
        <Select value={postType} onValueChange={setPostType}>
            <SelectTrigger className={className ?? 'w-[120px] '}>
                <SelectValue placeholder="Post Type" />
            </SelectTrigger>
            <SelectContent>
                {/* <SelectItem value="all">All</SelectItem> */}
                <SelectItem value="papers">Papers</SelectItem>
                <SelectItem value="userPosts">Posts</SelectItem>
                <SelectItem value="news" disabled>News</SelectItem>
            </SelectContent>
        </Select>
    );
}
