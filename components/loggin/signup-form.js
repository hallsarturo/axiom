'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createUser } from '@/lib/actions/actions';
import { useRouter } from 'next/navigation';
import { signupFormSchema } from '@/lib/schemas/auth';

export function SignupForm({ className, ...props }) {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const form = useForm({
        resolver: zodResolver(signupFormSchema),
        defaultValues: {
            email: '',
            mobilePhone: '',
            username: '',
            password: '',
            confirmPassword: '',
        },
        mode: 'onBlur',
    });

    async function onSubmit(values) {
        console.log(values);

        const result = await createUser(values);

        if (result.success) {
            document.cookie = `provisionalToken=${result.data.provisionalToken}; path=/; secure; samesite=strict`;

            router.push('sign-up/sms-verification');
        } else {
            setMessage(`Signup failed: ${result.error}`);
        }
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">
                        Sign up, it&apos;s free!
                    </CardTitle>
                    <CardDescription>
                        Join with your ORCID or Google account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <div className="flex flex-col gap-4">
                            <Button variant="outline" className="w-full">
                                <Image
                                    src="/orcid/ORCID-iD_icon_vector.svg"
                                    width={24}
                                    height={24}
                                    alt="ORCID logo"
                                ></Image>
                                Sign with ORCID
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full mb-6"
                                onClick={() => {
                                    window.location.href =
                                        process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL;
                                }}
                            >
                                <Image
                                    src="/google/signin-assets/Web (mobile + desktop)/svg/neutral/web_neutral_rd_na.svg"
                                    width={24}
                                    height={24}
                                    alt="Google Logo"
                                ></Image>
                                Sign in with Google
                            </Button>
                        </div>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-6">
                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                                        Or create an account with
                                    </span>
                                </div>
                                <div className="grid gap-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email*</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        placeholder="m@example.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                        className="grid gap-3"
                                    ></FormField>

                                    <FormField
                                        control={form.control}
                                        name="mobilePhone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Mobile Phone*
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="mobilePhone"
                                                        type="text"
                                                        placeholder="12133734253"
                                                        {...field}
                                                    ></Input>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                        className="grid gap-3"
                                    ></FormField>

                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username*</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="username"
                                                        type="text"
                                                        placeholder=""
                                                        {...field}
                                                    ></Input>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                        className="grid gap-3"
                                    ></FormField>

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password*</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="password"
                                                        type="password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                        className="grid gap-3"
                                    ></FormField>

                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Confirm Password*
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="confirmPassword"
                                                        type="password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                        className="grid gap-3"
                                    ></FormField>
                                    {message && (
                                        <div className="text-sm text-center py-2 text-red-500">
                                            {message}
                                        </div>
                                    )}

                                    <Button type="submit" className="w-full">
                                        Create account
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Already have an account?{' '}
                                    <Link
                                        href="/sign-in"
                                        className="underline underline-offset-4"
                                    >
                                        Sign in
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our{' '}
                <a href="#">Terms of Service</a> and{' '}
                <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
}
