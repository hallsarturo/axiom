import { toast } from 'sonner';

export function requireAuth() {
    let token = null;
    if (
        process.env.NODE_ENV === 'development' &&
        typeof window !== 'undefined'
    ) {
        token = localStorage.getItem('token');
    }

    if (!token) {
        toast.error('You need to be logged in to use this feature');
        return false;
    }
    return true;
}
