'use client';

import { useUser } from '@/components/context/UserProfileContext';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { CardPicker } from '@/components/dashboard/card-picker';
import { useEffect, useState } from 'react';
import { getDashboardData } from '@/lib/actions/actions';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
    const { user } = useUser();
    const [dashboardData, setDashboardData] = useState(null);
   

    useEffect(() => {
        async function fetchData() {
            let token = null
            if (process.env.NODE_ENV === 'development') {
                token = localStorage.getItem('token')
            } else {
                // In production, token is handled by HttpOnly cookie, do pass null
                token = null
            }
            const result = await getDashboardData(token);
            if (result.success) {
                setDashboardData(result.data);
            }
        }
        fetchData();
    }, []);

    return (
        // <ProtectedRoute>
        <div className="flex min-h-[calc(100vh-80px)] justify-center items-start mt-6">
            <main className="w-full max-w-6xl mx-auto">
                <h3 className="text-2xl text-primary text-right mb-2 tracking-tight">
                    {user ? (
                        <>
                            welcome{' '}
                            <span className="font-bold">{user.username}</span>
                        </>
                    ) : (
                        'Loading user...'
                    )}
                </h3>
                <h1 className="text-3xl font-medium uppercase text-center mb-10 text-gray-800 tracking-wide">
                    Configure your feed
                </h1>
                <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Left column */}
                    <div className="flex flex-col gap-8 md:col-span-1">
                        {/* First row: You are */}
                        <div className="flex flex-col h-full">
                            <h2 className="text-lg font-medium text-right mb-2 text-gray-700 uppercase tracking-wide">
                                You are:
                            </h2>
                        </div>
                        {/* Second row: Interested in */}
                        <div className="flex flex-col h-full">
                            <h2 className="text-lg font-medium text-right mb-2 text-gray-700 uppercase tracking-wide">
                                Interested in:
                            </h2>
                        </div>
                    </div>
                    {/* Right column */}
                    <div className="flex flex-col gap-8 md:col-span-3">
                        {/* Cards for "You are" */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Replace with dynamic cards for "You are" */}
                            <div className="flex gap-4">
                                {dashboardData?.degreeLevels &&
                                    dashboardData.degreeLevels.map((degree) => (
                                        <CardPicker
                                            key={degree.id}
                                            title={degree.name}
                                            imgSrc={degree.imgSrc}
                                            imgAlt={degree.imgAlt}
                                        />
                                    ))}
                            </div>
                        </div>
                        {/* Cards for "Interested in" */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Replace with dynamic cards for "Interested in" */}
                            <div className="flex gap-4">
                                {dashboardData?.degreeLevels &&
                                    dashboardData.subjects.map((degree) => (
                                        <CardPicker
                                            key={degree.id}
                                            title={degree.name}
                                            imgSrc={degree.imgSrc}
                                            imgAlt={degree.imgAlt}
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>
                </section>
                <div className="flex justify-center mt-12 gap-10">
                    <Button variant="outline">Clear all</Button>{' '}
                    <Button variant="default">Save</Button>
                </div>
            </main>
        </div>
        // </ProtectedRoute>
    );
}
