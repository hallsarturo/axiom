import { toast } from 'sonner';
import { useUser } from '@/context/UserProfileContext';

export function useRequireAuth() {
    const { user } = useUser();

    return () => {
        if (!user) {
            toast.error('You need to be logged in to use this feature');
            return false;
        }
        return true;
    };
}
