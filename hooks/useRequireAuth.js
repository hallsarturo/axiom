import { toast } from 'sonner';

export function requireAuth() {
    const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
        toast.error('You need to be logged in to use this feature');
        return false;
    }
    return true;
}
