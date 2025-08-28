import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function PostCardCommentForm() {
    return (
        <div className="flex w-full ">
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>Comment Form</div>
        </div>
    );
}
