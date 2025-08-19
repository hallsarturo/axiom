import { format, parseISO, formatDistanceToNow } from 'date-fns';

// Format a date string to "MMM dd, yyyy"
export function formatDate(dateString) {
    if (!dateString) return '';
    const date =
        typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM dd, yyyy');
}

// Format a date string to "x time ago"
export function timeAgo(dateString) {
    if (!dateString) return '';
    const date =
        typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return formatDistanceToNow(date, { addSuffix: true });
}
