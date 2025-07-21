'use client';

import { useUser } from '@/components/context/UserProfileContext';

export default function Feed() {
    const { user } = useUser();
    console.log(`context useUser: ${user}`)
    return (
        <div className="flex min-h-screen justify-center items-center mt-6">
            <main>
                <h1 className="text-5xl">Dahsboard</h1>
                <h2>
                    {user
                        ? `Wellcome ${user.username}!`
                        : 'Loading user...'}
                </h2>
            </main>
        </div>
    );
}
