import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export function SelectPostType({ defaultValue, className }) {
    return (
        <Select defaultValue={defaultValue}>
            <SelectTrigger className={className ?? 'w-[120px] '}>
                <SelectValue placeholder="Post Type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="papers">Papers</SelectItem>
                <SelectItem value="posts">Posts</SelectItem>
                <SelectItem value="news">News</SelectItem>
            </SelectContent>
        </Select>
    );
}
