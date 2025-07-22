'use client';

import { useUser } from '@/components/context/UserProfileContext';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { CardPicker } from '@/components/dashboard/card-picker';
import { useEffect, useState } from 'react';
import { getDashboardData } from '@/lib/actions/actions';

export default function Dashboard() {
    const { user } = useUser();
    const [dashboardData, setDashboardData] = useState(null);
    //console.log(`context useUser: ${user}`);

    useEffect(() => {
        async function fetchData() {
            const result = await getDashboardData();
            if (result.success) {
                console.log('reuslt:  ', result)
                setDashboardData(result.data);
            }
        }
        fetchData();
    }, []);

    return (
        // <ProtectedRoute>
        <div className="flex min-h-[calc(100vh-80px)] justify-center items-start mt-6">
            <main className="w-full max-w-6xl mx-auto">
                <h3 className="text-xl text-right font-medium mb-4">
                    {user ? `Wellcome ${user.username}` : 'Loading user...'}
                </h3>
                <h1 className="text-2xl text-center mb-10">
                    Configure your feed
                </h1>
                <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Left column */}
                    <div className="flex flex-col gap-8 md:col-span-1">
                        {/* First row: You are */}
                        <div className="flex flex-col h-full">
                            <h2 className="text-xl text-right mb-2">
                                You are:
                            </h2>
                        </div>
                        {/* Second row: Interested in */}
                        <div className="flex flex-col h-full">
                            <h2 className="text-xl text-right mb-2">
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
                            <div className="bg-white rounded-lg shadow p-6">
                                Card A
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                Card B
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                Card C
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                Card D
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
        // </ProtectedRoute>
    );
}
