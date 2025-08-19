'use server';

import { revalidatePath } from 'next/cache';

// USER ACTIONS

export async function loginUser(values) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
                credentials: 'include',
            }
        );

        if (!res.ok) {
            const { message } = await res.json();
            return { success: false, error: message };
        }

        const data = await res.json();
        revalidatePath('/feed');

        return { success: true, data };
    } catch (err) {
        console.error('Login error:', err);
        return { success: false, error: 'Network error' };
    }
}

export async function createUser(values) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/signup`,
            {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            }
        );

        if (!res.ok) {
            const { error } = await res.json();
            return { success: false, error };
        }

        const data = await res.json();

        return { success: true, data };
    } catch (err) {
        console.error('Login error: ', err);
        return { success: false, error: err };
    }
}

export async function logoutUser() {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/logout`,
            {
                method: 'POST',
                credentials: 'include',
            }
        );

        revalidatePath('/sign-in');
        return { success: true };
    } catch (err) {
        console.error('Logout error: ', err);
        return { success: false, error: 'Logout failed' };
    }
}

export async function sendOtpCode(code, token) {
    console.log('code: ', code);
    try {
        const payload = {
            ...code, // e.g. { otpSignup: '123456' }
        };

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/signup/verify`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            }
        );

        if (!res.ok) {
            const { error } = await res.json();
            return { success: false, error };
        }
        revalidatePath('/dashboard');
        const data = await res.json();
        return { success: true, data };
    } catch (err) {
        console.error('Login error: ', err);
        return { success: false, error: err };
    }
}

export async function getUserProfile(token) {
    try {
        let headers = { 'Content-Type': 'application/json' };
        // Only add Authorization header in dev, and only if running on client
        if (process.env.NODE_ENV === 'development') {
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
        }
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/`,
            {
                method: 'GET',
                headers,
                credentials: 'include',
            }
        );
        if (!res.ok) {
            //console.log('getUserProfile !res.ok', res);
            return null;
        }
        const data = await res.json();
        //console.log('getUserProfile data', data);

        if (!data.user) {
            console.error('No user found in response', res);
            return null;
        }

        return {
            user: {
                ...data.user, // include all backend user fields
                isLoggedIn: true,
            },
        };
    } catch (err) {
        console.error('error fetching user profile:', err);
        return null;
    }
}

export async function getUserProfileById(userId) {
    try {
        let headers = { 'Content-Type': 'application/json' };
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}`,
            {
                method: 'GET',
                headers,
                credentials: 'include',
            }
        );
        if (!res.ok) {
            //console.log('getUserProfileById !res.ok', res);
            return null;
        }
        const data = await res.json();
        //console.log('getUserProfileById data', data);

        if (!data.user) {
            console.error('No user found in response', res);
            return null;
        }

        return {
            user: {
                ...data.user,
            },
        };
    } catch (err) {
        console.error('error geting publlic user profile:', err);
        return null;
    }
}

// FOLLOWERS
// Get followers of a user
export async function getFollowersById(userId) {
    try {
        let headers = { 'Content-Type': 'application/json' };
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/followers/${userId}`,
            {
                method: 'GET',
                headers,
            }
        );
        if (!res.ok) {
            //console.log('getFollowersById !res.ok', res);
            return null;
        }
        const data = await res.json();
        console.log('getFollowersById data', data);

        if (!data.followers) {
            console.error('No followers found in response', res);
            return null;
        }

        return {
            followers: data.followers,
            totalFollowers: data.totalFollowers
        };
    } catch (err) {
        console.error('error fetching user followers:', err);
        return null;
    }
}
export async function getFollowingsById(userId) {
    try {
        let headers = { 'Content-Type': 'application/json' };
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/followers/${userId}/following`,
            {
                method: 'GET',
                headers,
            }
        );
        if (!res.ok) {
            //console.log('getFollowingsById !res.ok', res);
            return null;
        }
        const data = await res.json();
        console.log('getFollowingsById data', data);

        if (!data.following) {
            console.error('No followings found in response', res);
            return null;
        }

        return {
            following: data.following,
            totalFollowings: data.totalFollowings
        };
    } catch (err) {
        console.error('error fetching user followers:', err);
        return null;
    }
}

export async function putFollower(token, targetUserId) {
    try {
        let headers = { 'Content-Type': 'application/json' };
        // Only add Authorization header in dev, and only if running on client
        if (process.env.NODE_ENV === 'development') {
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
        }
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/followers/${targetUserId}`,
            {
                method: 'PUT',
                headers,
                credentials: 'include',
            }
        );
        if (!res.ok) {
            //console.log('getFollowingsById !res.ok', res);
            return null;
        }
        const data = await res.json();
        console.log('putFollower data', data);
        return {
            message: data.message,
            following: data.following ?? [],
        };
    } catch (err) {
        console.error('error fetching user profile:', err);
        return null;
    }
}

// DASHBOARD ACTIONS
export async function getDashboardData(token) {
    try {
        let headers = { 'Content-Type': 'application/json' };
        // Only add Authorization header in dev, and only if running on client
        if (process.env.NODE_ENV === 'development') {
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
        }
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`,
            {
                method: 'GET',
                headers,
                credentials: 'include',
            }
        );

        if (!res.ok) {
            const { message } = await res.json();
            return { success: false, error: message };
        }

        const data = await res.json();
        revalidatePath('/dashboard');
        return { success: true, data };
    } catch (err) {
        console.error('getDashboardData error:', err);
        return { success: false, error: 'Network error' };
    }
}

export async function getCategoriesData(token, parentId) {
    try {
        let headers = { 'Content-Type': 'application/json' };
        // Only add Authorization header in dev, and only if running on client
        if (process.env.NODE_ENV === 'development') {
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
        }
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/categories/${parentId}`,
            {
                method: 'GET',
                headers,
                credentials: 'include',
            }
        );

        if (!res.ok) {
            const { message } = await res.json();
            return { success: false, error: message };
        }

        const data = await res.json();
        console.log('getSubCategories ', data);
        revalidatePath('/dashboard');
        return { success: true, data };
    } catch (err) {
        console.error('getDashboardData error:', err);
        return { success: false, error: 'Network error' };
    }
}

export async function updateUserConfig(token, values) {
    try {
        let headers = { 'Content-Type': 'application/json' };
        // Only add Authorization header in dev, and only if running on client
        if (process.env.NODE_ENV === 'development') {
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
        }
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/preferences/`,
            {
                method: 'PUT',
                headers,
                credentials: 'include',
                body: JSON.stringify(values),
            }
        );

        if (!res.ok) {
            const { message } = await res.json();
            return { success: false, error: message };
        }

        const data = await res.json();
        console.log('success');

        return { success: true, data };
    } catch (err) {
        console.error('updateUserConfig: ', err);
        return { success: false, error: 'Network error' };
    }
}

// FEED ACTIONS
export async function getPaperPosts(
    token,
    page = 1,
    pageSize = 20,
    timestamp = null
) {
    try {
        const url = new URL(
            `${process.env.NEXT_PUBLIC_API_URL}/api/posts/papers`
        );

        // Add pagination parameters
        url.searchParams.append('page', page);
        url.searchParams.append('pageSize', pageSize);
        if (timestamp) url.searchParams.append('_t', timestamp); // Add cache busting

        let headers = {};
        if (process.env.NODE_ENV === 'development' && token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch(url, {
            headers,
            credentials: 'include',
        });

        if (!res.ok) {
            return { success: false, error: 'Failed to fetch posts' };
        }

        const data = await res.json();
        // Add debug logging
        console.log(`Paper posts response for page ${page}:`, {
            count: data.paperPosts?.length,
            pagination: data.pagination,
        });
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching paper posts:', error);
        return { success: false, error: 'Error fetching posts' };
    }
}

export async function putReaction(token, userId, postId, reaction) {
    try {
        const payload = {
            userId,
            postId,
            reaction,
        };
        let headers = { 'Content-Type': 'application/json' };
        // Only add Authorization header in dev, and only if running on client
        if (process.env.NODE_ENV === 'development') {
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/posts/reaction`,
            {
                method: 'PUT',
                headers,
                credentials: 'include',
                body: JSON.stringify(payload),
            }
        );

        if (!res.ok) {
            const { message } = await res.json();
            return { success: false, error: message };
        }

        const data = await res.json();
        // PRO check if there's a better hidration way
        revalidateTag('feed-posts');
        return { success: true, data };
    } catch (error) {
        console.error('putReaction error: ', error);
        return { success: false, error: 'Network error' };
    }
}

export async function publishPost(token, values) {
    try {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('content', values.content || '');
        if (values.image) {
            formData.append('image', values.image);
        }

        let headers = {};
        if (process.env.NODE_ENV === 'development' && token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/posts/user-publish`,
            {
                method: 'POST',
                headers,
                credentials: 'include',
                body: formData,
            }
        );

        if (!res.ok) {
            const { message } = await res.json();
            return { success: false, error: message };
        }

        const data = await res.json();

        // Server-side revalidation for feed
        revalidatePath('/feed');

        return { success: true, data };
    } catch (error) {
        console.error('publishPost error: ', error);
        return { success: false, error: 'Network error' };
    }
}

export async function getUserPosts(
    token,
    page = 1,
    pageSize = 20,
    timestamp = null
) {
    try {
        const url = new URL(
            `${process.env.NEXT_PUBLIC_API_URL}/api/posts/userposts`
        );

        // Add pagination parameters
        url.searchParams.append('page', page);
        url.searchParams.append('pageSize', pageSize);
        if (timestamp) url.searchParams.append('_t', timestamp); // Cache-busting

        let headers = {};
        if (process.env.NODE_ENV === 'development' && token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch(url, {
            headers,
            credentials: 'include',
        });

        if (!res.ok) {
            return { success: false, error: 'Failed to fetch userPosts' };
        }

        const data = await res.json();
        // console.log('getUserPosts data: ', data);
        return { success: true, data };
    } catch (err) {
        console.error('getUserPosts error: ', err);
        return { success: false, error: 'Network error' };
    }
}

export async function getNewsPosts() {
    try {
    } catch (err) {
        console.error('getNewsPosts: ', err);
        return { success: false, error: 'Network error' };
    }
}

export async function deleteUserPost(token, postId) {
    try {
        let headers = {};
        if (process.env.NODE_ENV === 'development' && token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const url = new URL(
            `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`
        );
        const res = await fetch(url, {
            method: 'DELETE',
            headers,
            credentials: 'include',
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to delete: ${res.status} ${text}`);
        }
        return { success: true };
    } catch (err) {
        console.error('deleteUserPost error:', err);
        // Try to extract backend error from err.message
        let errorMsg = 'Network error';
        if (err && err.message) {
            // Example: "Failed to delete: 403 {"error":"You are not authorized to delete this post"}"
            const match = err.message.match(/{.*}/);
            if (match) {
                try {
                    const backendError = JSON.parse(match[0]);
                    errorMsg = backendError.error || err.message;
                } catch {
                    errorMsg = err.message;
                }
            } else {
                errorMsg = err.message;
            }
        }
        return { success: false, error: errorMsg };
    }
}

// Search

export async function getSearchResults(query) {
    try {
        const url = new URL(
            `${process.env.NEXT_PUBLIC_API_URL}/api/search?q=${encodeURIComponent(query)}`
        );

        const res = await fetch(url);

        if (!res.ok) {
            return { success: false, error: 'Failed to fetch searchResults' };
        }

        const data = await res.json();
        // console.log('getUserPosts data: ', data);
        return { success: true, data };
    } catch (err) {
        console.error('getSearchResults error: ', err);
        return { success: false, error: 'Network error' };
    }
}
