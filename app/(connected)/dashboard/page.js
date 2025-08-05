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
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { CategoriesBadger } from '@/components/dashboard/categories-badger';
import { ImageDroper } from '@/components/file-handling/image-droper';
import { useUser } from '@/components/context/UserProfileContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { configFormSchema } from '@/lib/schemas/dashboard-config';
import { updateUserConfig } from '@/lib/actions/actions';

export default function Dashboard() {
    const { user, refreshUser } = useUser();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [message, setMessage] = useState('');
    const form = useForm({
        resolver: zodResolver(configFormSchema),
        defaultValues: {
            about: '',
            degreeLevel: '', // empty string for enum
            categories: [], // empty array for categories
            image: null,
        },
    });

    // Form submition
    async function onSubmit(values) {
        let token = null;
        if (
            process.env.NODE_ENV === 'development' &&
            typeof window !== 'undefined'
        ) {
            token = localStorage.getItem('token');
        }
        const result = await updateUserConfig(token, values);

        if (result.success) {
            toast.success('preferences saved!');
        } else {
            toast.error('error saving preferences');
            setMessage(`save failed: ${result.error}`);
        }
    }

    useEffect(() => {
        if (user) {
            const categoryIds = Array.isArray(user.categories)
                ? user.categories.map((cat) => cat.id)
                : [];
            form.reset({
                about: user.about || '',
                degreeLevel: String(user.degreeLevel.id) || '', // dynamic from user or ''
                categories: categoryIds || [], // dynamic from user or []
            });
        }
    }, [user, form]);

    return (
        <div className="flex flex-col items-center w-full my-4 md:my-6">
            <div className="w-full max-w-xl lg:max-w-2xl">
                <Card className="p-4 sm:p-6 md:p-8 bg-card text-card-foreground transition-colors">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="space-y-6 md:space-y-12">
                                <div className="border-b border-border pb-6 md:pb-12">
                                    <h1 className="text-base font-semibold text-primary text-right md:text-lg">
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
                                    <h2 className="text-base font-semibold text-primary md:text-lg">
                                        Configuration
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground md:text-base">
                                        We need some information about you to give you matching topics in your feed
                                    </p>
                                    <div className="mt-4 grid grid-cols-1 gap-y-4 md:gap-x-6 md:gap-y-8 md:grid-cols-6">
                                        <div className="col-span-full">
                                            <FormField
                                                control={form.control}
                                                name="about"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel
                                                            htmlFor="about"
                                                            className="block text-sm font-medium text-foreground md:mb-[-12px] md:text-base"
                                                        >
                                                            About
                                                        </FormLabel>
                                                        <p className="text-sm text-muted-foreground md:text-base">
                                                            Let the community know your areas of expertise.
                                                        </p>
                                                        <FormControl>
                                                            <Textarea
                                                                {...field}
                                                                id="about"
                                                                name="about"
                                                                rows={3}
                                                                className="block w-full rounded-md px-3 py-1.5 text-base text-foreground outline-1 -outline-offset-1 outline-border placeholder:text-muted-foreground focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-full">
                                            <label
                                                htmlFor="photo"
                                                className="block text-sm font-medium text-foreground md:text-base"
                                            >
                                                Photo
                                            </label>
                                            <div className="mt-2 flex flex-col items-center gap-y-2 md:flex-row md:justify-around md:items-center md:gap-x-2">
                                                <Avatar className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36">
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
                                                <div>
                                                    <input
                                                        className="w-[120px] h-[0px] md:w-[150px]"
                                                        disabled={true}
                                                    />
                                                    <ImageDroper
                                                        className="rounded-full overflow-hidden flex items-center justify-center filepond"
                                                        name="file"
                                                        onprocessfile={() => {
                                                            refreshUser();
                                                            toast.success('Profile image updated!');
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b border-border pb-6 md:pb-12">
                                    <FormField
                                        control={form.control}
                                        name="degreeLevel"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-semibold text-primary md:text-lg">
                                                    Degree level
                                                </FormLabel>
                                                <p className="mt-1 text-sm text-muted-foreground md:text-base">
                                                    If you link your ORCID account, you can activate the &quot;active researcher / profesor&quot; mode,
                                                    <br className="hidden md:block" />
                                                    and reach more users.
                                                </p>
                                                <FormControl>
                                                    <RadioGroup
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                        className="flex flex-col gap-y-2 mt-4 md:flex-row md:justify-around md:mt-8 cursor-pointer"
                                                        orientation="horizontal"
                                                    >
                                                        <div className="flex items-center space-x-2 cursor-pointer">
                                                            <RadioGroupItem value="1" id="1" />
                                                            <Label htmlFor="1" className="cursor-pointer text-foreground">
                                                                Enthusiast
                                                            </Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="2" id="2" />
                                                            <Label htmlFor="2" className="cursor-pointer text-foreground">
                                                                Student
                                                            </Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="3" id="3" />
                                                            <Label htmlFor="3" className="cursor-pointer text-foreground">
                                                                Researcher/Profesor
                                                            </Label>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="border-b border-border pb-6 md:pb-12">
                                    <FormField
                                        control={form.control}
                                        name="categories"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Interested in:
                                                </FormLabel>
                                                <FormControl>
                                                    <CategoriesBadger
                                                        className="flex flex-wrap gap-2 mt-4 md:flex-row md:mt-8"
                                                        selected={field.value || []}
                                                        onSelectionChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="mt-4 md:mt-6 flex flex-col items-center gap-y-4 md:flex-row md:items-center md:justify-end md:gap-x-6">
                                {message && (
                                    <div className="text-sm text-center py-2 text-red-500">
                                        {message}
                                    </div>
                                )}
                                <Button
                                    type="button"
                                    onClick={() => form.reset()}
                                    variant="secondary"
                                    className="w-full md:w-auto"
                                >
                                    Revert changes
                                </Button>
                                <Button type="submit" className="w-full md:w-auto">
                                    Save
                                </Button>
                            </div>
                        </form>
                    </Form>
                </Card>
            </div>
        </div>
    );
}
