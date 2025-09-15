import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { normalizeImageUrl } from '@/lib/utils/image';
import { genInitials } from '@/lib/utils/strings';

export function AvatarList({
    userProfilePic,
    photoUrl,
    username,
    size = 'h-8 w-8',
}) {
    return (
        <div>
            <Avatar className={size}>
                <AvatarImage
                    src={normalizeImageUrl(
                        userProfilePic || photoUrl || '/user_silhouette_2.png'
                    )}
                />
                <AvatarFallback>
                    {genInitials(username || displayName)}
                </AvatarFallback>
            </Avatar>
        </div>
    );
}
