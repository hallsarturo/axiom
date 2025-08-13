export function normalizeImageUrl(url) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    // If it's a backend-served image, prepend API URL
    if (url.startsWith('/uploads/')) {
        return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
    }
    if (!url.startsWith('/'))
        return `${process.env.NEXT_PUBLIC_API_URL}/${url}`;
    return url;
}
