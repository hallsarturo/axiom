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
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { CategoriesBadger } from '@/components/dashboard/categories-badger';
import { useUser } from '@/components/context/UserProfileContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { configFormSchema } from '@/lib/schemas/dashboard-config';
import { ImageDroper } from '@/components/file-handling/image-droper';
import { toast } from 'sonner';

export default function Dashboard() {
    const { user } = useUser();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [message, setMessage] = useState('');
    const form = useForm({
        resolver: zodResolver(configFormSchema),
        defaultValues: {
            about: '',
            degreeLevel: null,
            categories: null,
            image: null,
        },
    });

    // Pull the categories from CategoriesBadger
    const handleCategoriesChange = (ids) => {
        setSelectedCategories(ids);
    };

    // Form submition
    async function onSubmit(values) {
        const result = await updateUserConfig(values);

        if (result.success) {
        } else {
            setMessage(`save failed: ${result.error}`);
        }
    }

    return (
        <div className="flex justify-center items-start mt-6">
            <div>
                <Card className="p-8 bg-card text-card-foreground transition-colors">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="space-y-12">
                                <div className="border-b border-border pb-12">
                                    <h1 className="text-base/8 font-semibold text-primary text-right">
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
                                    <h2 className="text-base/7 font-semibold text-primary">
                                        Configuration
                                    </h2>
                                    <p className="mt-1 text-sm/6 text-muted-foreground">
                                        We need some information about you to
                                        give you matching topics in your feed
                                    </p>
                                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                        {/* <div className="sm:col-span-4">
                                            <label
                                                htmlFor="username"
                                                className="block text-sm/6 font-medium text-foreground"
                                            >
                                                Username
                                            </label>
                                            <div className="mt-2">
                                                <div className="flex items-center rounded-md pl-3 outline-1 -outline-offset-1 outline-border focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-primary">
                                                    <div className="shrink-0 text-base text-muted-foreground select-none sm:text-sm/6"></div>
                                                    <input
                                                        id="username"
                                                        name="username"
                                                        type="text"
                                                        placeholder="janesmith"
                                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-foreground placeholder:text-muted-foreground focus:outline-none sm:text-sm/6"
                                                    />
                                                </div>
                                            </div>
                                        </div> */}
                                        <div className="col-span-full">
                                            <FormField
                                                control={form.control}
                                                name="about"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel
                                                            htmlFor="about"
                                                            className="block text-sm/6 font-medium text-foreground"
                                                        >
                                                            About
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                id="about"
                                                                name="about"
                                                                rows={3}
                                                                className="block w-full rounded-md px-3 py-1.5 text-base text-foreground outline-1 -outline-offset-1 outline-border placeholder:text-muted-foreground focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                                                                defaultValue={
                                                                    ''
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            >
                                                <div className="mt-2"></div>
                                                <p className="mt-3 text-sm/6 text-muted-foreground">
                                                    Let the community know your
                                                    areas of expertise.
                                                </p>
                                            </FormField>
                                        </div>
                                        <div className="col-span-full">
                                            <label
                                                htmlFor="photo"
                                                className="block text-sm/6 font-medium text-foreground"
                                            >
                                                Photo
                                            </label>
                                            <div className="mt-2 flex justify-around items-center gap-x-2">
                                                <Avatar className="w-36 h-36">
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

                                                <div className="">
                                                    <input
                                                        className="w-[150px] h-[0px]"
                                                        disabled={true}
                                                    />
                                                    <ImageDroper
                                                        className="rounded-full overflow-hidden flex items-center justify-center filepond"
                                                        name="file"
                                                        onprocessfile={() => {
                                                            console.log(
                                                                'success!'
                                                            );
                                                            toast.success(
                                                                'Profile image updated!'
                                                            );
                                                        }}
                                                    ></ImageDroper>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b border-border pb-12">
                                    <h2 className="text-base/7 font-semibold text-primary">
                                        Degree level
                                    </h2>
                                    <p className="mt-1 text-sm/6 text-muted-foreground">
                                        If you link your ORCID account, you can
                                        activate the &quot;active researcher /
                                        profesor&quot; mode, <br />
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
                                                    className="cursor-pointer text-foreground"
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
                                                    className="cursor-pointer text-foreground"
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
                                                    className="cursor-pointer text-foreground"
                                                    htmlFor="researcher-profesor"
                                                >
                                                    Researcher/Profesor
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </div>
                                <div className="border-b border-border pb-12">
                                    <h2 className="text-base/7 font-semibold text-primary">
                                        Interested in:
                                    </h2>
                                    <p className="mt-1 text-sm/6 text-muted-foreground">
                                        We&apos;ll use this to nurture our
                                        ethical social algorithm
                                    </p>
                                    <div className="flex justify-center">
                                        <CategoriesBadger
                                            className="flex flex-row mt-8"
                                            onSelectionChange={
                                                handleCategoriesChange
                                            }
                                        />
                                    </div>
                                </div>
                                {/* <div className="border-b border-border pb-12">
                                    <h2 className="text-base/7 font-semibold text-primary">
                                        Notifications
                                    </h2>
                                    <p className="mt-1 text-sm/6 text-muted-foreground">
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
                                </div> */}
                            </div>
                            <div className="mt-6 flex items-center justify-end gap-x-6">
                                <Button variant="secondary">Cancel</Button>
                                <Button type="submit">Save</Button>
                            </div>
                        </form>
                    </Form>
                </Card>
            </div>
        </div>
    );
}
