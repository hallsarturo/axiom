'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { CardPicker } from '@/components/dashboard/card-picker';
import { Button } from '@/components/ui/button';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CategoriesBadger } from '@/components/dashboard/categories-badger';
import { useUser } from '@/components/context/UserProfileContext';
import { useEffect, useState } from 'react';
import { getDashboardData } from '@/lib/actions/actions';

export default function Dashboard() {
    const { user } = useUser();
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            let token = null;
            if (process.env.NODE_ENV === 'development') {
                token = localStorage.getItem('token');
            } else {
                // In production, token is handled by HttpOnly cookie, do pass null
                token = null;
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
        <div className="flex justify-center items-start mt-6">
            <div className="">
                <Card className="p-8">
                    <form>
                        <div className="space-y-12">
                            <div className="border-b border-gray-900/10 pb-12">
                                <h1 className="text-base/8 font-semibold text-gray-900 text-right">
                                    {user ? (
                                        <>
                                            welcome{' '}
                                            <span className="font-bold">
                                                {user.username}
                                            </span>
                                        </>
                                    ) : (
                                        'Loading user...'
                                    )}
                                </h1>
                                <h2 className="text-base/7 font-semibold text-gray-900">
                                    Configuration
                                </h2>
                                <p className="mt-1 text-sm/6 text-gray-600">
                                    We need some information about you to give
                                    you matching topics in your feed
                                </p>
                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div className="sm:col-span-4">
                                        <label
                                            htmlFor="username"
                                            className="block text-sm/6 font-medium text-gray-900"
                                        >
                                            Username
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                                <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6"></div>
                                                <input
                                                    id="username"
                                                    name="username"
                                                    type="text"
                                                    placeholder="janesmith"
                                                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-full">
                                        <label
                                            htmlFor="about"
                                            className="block text-sm/6 font-medium text-gray-900"
                                        >
                                            About
                                        </label>
                                        <div className="mt-2">
                                            <textarea
                                                id="about"
                                                name="about"
                                                rows={3}
                                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                                defaultValue={''}
                                            />
                                        </div>
                                        <p className="mt-3 text-sm/6 text-gray-600">
                                            Write a few sentences about
                                            yourself.
                                        </p>
                                    </div>
                                    <div className="col-span-full">
                                        <label
                                            htmlFor="photo"
                                            className="block text-sm/6 font-medium text-gray-900"
                                        >
                                            Photo
                                        </label>
                                        <div className="mt-2 flex items-center gap-x-3">
                                            <Avatar className="w-14 h-14">
                                                <AvatarImage
                                                    src={
                                                        user
                                                            ? user.photoUrl
                                                            : 'https://github.com/shadcn.png'
                                                    }
                                                />
                                                <AvatarFallback>
                                                    CN
                                                </AvatarFallback>
                                            </Avatar>
                                            <button
                                                type="button"
                                                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
                                            >
                                                Change
                                            </button>
                                        </div>
                                    </div>
                                    {/* <div className="col-span-full">
                                        <label
                                            htmlFor="cover-photo"
                                            className="block text-sm/6 font-medium text-gray-900"
                                        >
                                            Cover photo
                                        </label>
                                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                            <div className="text-center">
                                                <PhotoIcon
                                                    aria-hidden="true"
                                                    className="mx-auto size-12 text-gray-300"
                                                />
                                                <div className="mt-4 flex text-sm/6 text-gray-600">
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500"
                                                    >
                                                        <span>
                                                            Upload a file
                                                        </span>
                                                        <input
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file"
                                                            className="sr-only"
                                                        />
                                                    </label>
                                                    <p className="pl-1">
                                                        or drag and drop
                                                    </p>
                                                </div>
                                                <p className="text-xs/5 text-gray-600">
                                                    PNG, JPG, GIF up to 10MB
                                                </p>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                            <div className="border-b border-gray-900/10 pb-12">
                                <h2 className="text-base/7 font-semibold text-gray-900">
                                    Degree level
                                </h2>
                                <p className="mt-1 text-sm/6 text-gray-600">
                                    If you link your ORCID account, you can
                                    activate the &quot;active researcher /
                                    profesor&quot; mode, <br></br>
                                    and reach more users.
                                </p>

                                <div className="flex justify-center">
                                    <RadioGroup
                                        className="flex flex-row mt-8 gap-8 cursor-pointer"
                                        orientation="horizontal"
                                        defaultValue=""
                                    >
                                        <div className="flex items-center space-x-2 cursor-pointer">
                                            <RadioGroupItem
                                                value="enthusiast"
                                                id="enthusiast"
                                            />
                                            <Label
                                                className="cursor-pointer"
                                                htmlFor="enthusiast"
                                            >
                                                Enthusiast
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="student"
                                                id="student"
                                            />
                                            <Label
                                                className="cursor-pointer"
                                                htmlFor="student"
                                            >
                                                Student
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="researcher-profesor"
                                                id="researcher-profesor"
                                            />
                                            <Label
                                                className="cursor-pointer"
                                                htmlFor="researcher-profesor"
                                            >
                                                Researcher/Profesor
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                            <div className="border-b border-gray-900/10 pb-12">
                                <h2 className="text-base/7 font-semibold text-gray-900">
                                    Interested in:
                                </h2>
                                <p className="mt-1 text-sm/6 text-gray-600">
                                    We&apos;ll use this to nurture our ethical
                                    social algorithm
                                </p>
                                <div className="flex justify-center">
                                    <CategoriesBadger className="mt-4"></CategoriesBadger>
                                </div>
                            </div>
                            <div className="border-b border-gray-900/10 pb-12">
                                <h2 className="text-base/7 font-semibold text-gray-900">
                                    Notifications
                                </h2>
                                <p className="mt-1 text-sm/6 text-gray-600">
                                    We&apos;ll always let you know about
                                    important changes, but you pick what else
                                    you want to hear about.
                                </p>
                                <div className="mt-10 space-y-10">
                                    <fieldset>
                                        <legend className="text-sm/6 font-semibold text-gray-900">
                                            By email
                                        </legend>
                                        <div className="mt-6 space-y-6">
                                            <div className="flex gap-3">
                                                <div className="flex h-6 shrink-0 items-center">
                                                    <div className="group grid size-4 grid-cols-1">
                                                        <input
                                                            defaultChecked
                                                            id="comments"
                                                            name="comments"
                                                            type="checkbox"
                                                            aria-describedby="comments-description"
                                                            className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                                        />
                                                        <svg
                                                            fill="none"
                                                            viewBox="0 0 14 14"
                                                            className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                                        >
                                                            <path
                                                                d="M3 8L6 11L11 3.5"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="opacity-0 group-has-checked:opacity-100"
                                                            />
                                                            <path
                                                                d="M3 7H11"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="opacity-0 group-has-indeterminate:opacity-100"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="text-sm/6">
                                                    <label
                                                        htmlFor="comments"
                                                        className="font-medium text-gray-900"
                                                    >
                                                        Comments
                                                    </label>
                                                    <p
                                                        id="comments-description"
                                                        className="text-gray-500"
                                                    >
                                                        Get notified when
                                                        someones posts a comment
                                                        on a posting.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="flex h-6 shrink-0 items-center">
                                                    <div className="group grid size-4 grid-cols-1">
                                                        <input
                                                            id="candidates"
                                                            name="candidates"
                                                            type="checkbox"
                                                            aria-describedby="candidates-description"
                                                            className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                                        />
                                                        <svg
                                                            fill="none"
                                                            viewBox="0 0 14 14"
                                                            className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                                        >
                                                            <path
                                                                d="M3 8L6 11L11 3.5"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="opacity-0 group-has-checked:opacity-100"
                                                            />
                                                            <path
                                                                d="M3 7H11"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="opacity-0 group-has-indeterminate:opacity-100"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="text-sm/6">
                                                    <label
                                                        htmlFor="candidates"
                                                        className="font-medium text-gray-900"
                                                    >
                                                        Candidates
                                                    </label>
                                                    <p
                                                        id="candidates-description"
                                                        className="text-gray-500"
                                                    >
                                                        Get notified when a
                                                        candidate applies for a
                                                        job.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="flex h-6 shrink-0 items-center">
                                                    <div className="group grid size-4 grid-cols-1">
                                                        <input
                                                            id="offers"
                                                            name="offers"
                                                            type="checkbox"
                                                            aria-describedby="offers-description"
                                                            className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                                        />
                                                        <svg
                                                            fill="none"
                                                            viewBox="0 0 14 14"
                                                            className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                                        >
                                                            <path
                                                                d="M3 8L6 11L11 3.5"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="opacity-0 group-has-checked:opacity-100"
                                                            />
                                                            <path
                                                                d="M3 7H11"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="opacity-0 group-has-indeterminate:opacity-100"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="text-sm/6">
                                                    <label
                                                        htmlFor="offers"
                                                        className="font-medium text-gray-900"
                                                    >
                                                        Offers
                                                    </label>
                                                    <p
                                                        id="offers-description"
                                                        className="text-gray-500"
                                                    >
                                                        Get notified when a
                                                        candidate accepts or
                                                        rejects an offer.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <legend className="text-sm/6 font-semibold text-gray-900">
                                            Push notifications
                                        </legend>
                                        <p className="mt-1 text-sm/6 text-gray-600">
                                            These are delivered via SMS to your
                                            mobile phone.
                                        </p>
                                        <div className="mt-6 space-y-6">
                                            <div className="flex items-center gap-x-3">
                                                <input
                                                    defaultChecked
                                                    id="push-everything"
                                                    name="push-notifications"
                                                    type="radio"
                                                    className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                                                />
                                                <label
                                                    htmlFor="push-everything"
                                                    className="block text-sm/6 font-medium text-gray-900"
                                                >
                                                    Everything
                                                </label>
                                            </div>
                                            <div className="flex items-center gap-x-3">
                                                <input
                                                    id="push-email"
                                                    name="push-notifications"
                                                    type="radio"
                                                    className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                                                />
                                                <label
                                                    htmlFor="push-email"
                                                    className="block text-sm/6 font-medium text-gray-900"
                                                >
                                                    Same as email
                                                </label>
                                            </div>
                                            <div className="flex items-center gap-x-3">
                                                <input
                                                    id="push-nothing"
                                                    name="push-notifications"
                                                    type="radio"
                                                    className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                                                />
                                                <label
                                                    htmlFor="push-nothing"
                                                    className="block text-sm/6 font-medium text-gray-900"
                                                >
                                                    No push notifications
                                                </label>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-end gap-x-6">
                            <button
                                type="button"
                                className="text-sm/6 font-semibold text-gray-900"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
        // </ProtectedRoute>
    );
}

// <h3 className="text-2xl text-primary text-right mb-2 tracking-tight">
//     {user ? (
//         <>
//             welcome{' '}
//             <span className="font-bold">{user.username}</span>
//         </>
//     ) : (
//         'Loading user...'
//     )}
// </h3>
