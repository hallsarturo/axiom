import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export function SelectPostType() {
    return (
        <Select>
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Post Type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="light">Papers</SelectItem>
                <SelectItem value="dark">News</SelectItem>
                <SelectItem value="system">Posts</SelectItem>
            </SelectContent>
        </Select>
    );
}
