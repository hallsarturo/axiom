import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UserAvatar({ user, className, size = 'md' }) {
    // Size classes
    const sizeClasses = {
        sm: 'size-8',
        md: 'size-10',
        lg: 'size-14',
        xl: 'size-20',
    };

    return (
        <Avatar className={`${sizeClasses[size]} ${className || ''}`}>
            <AvatarImage
                src={
                    user?.userProfilePic ||
                    user?.photoUrl ||
                    '/user_silhouette_2.png'
                }
            />
            <AvatarFallback>
                {user ? (
                    genInitials(user.username)
                ) : (
                    <AvatarImage src="/user_silhouette_2.png" />
                )}
            </AvatarFallback>
        </Avatar>
    );
}

// Then use it everywhere:
// <UserAvatar user={comment} size="sm" />
