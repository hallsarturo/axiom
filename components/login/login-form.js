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
import { useRouter } from 'next/navigation';
import { loginFormSchema } from '@/lib/schemas/auth';
import { AuthDebugger } from '@/lib/state/auth-debugger';
import { Loader2 } from 'lucide-react';

export function LoginForm({ className, ...props }) {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    async function onSubmit(values) {
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setMessage(`Login failed: ${data.message || 'Unknown error'}`);
                setLoading(false);
                return;
            }

            // Verify authentication before redirecting
            // try {
            //     const verifyResult = await fetch(
            //         `${process.env.NEXT_PUBLIC_API_URL}/api/verify-auth`,
            //         {
            //             method: 'GET',
            //             credentials: 'include',
            //         }
            //     );

            //     if (verifyResult.ok) {
            //         // Successful login, redirect to feed
            //         window.location.replace('/feed');
            //     } else {
            //         setMessage('Authentication failed. Please try again.');
            //     }
            // } catch (err) {
            //     setMessage('Network error during authentication verification');
            // }
            window.location.replace('/feed');
        } catch (err) {
            console.error('Login error:', err);
            setMessage('Network error. Please try again later.');
        }
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Sign in</CardTitle>
                    <CardDescription>
                        {/* <AuthDebugger /> */}
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
                                    alt="Picture of the author"
                                ></Image>
                                Log in with ORCID
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    window.location.href =
                                        process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL;
                                }}
                            >
                                <Image
                                    src="/google/web_neutral_rd_na.svg"
                                    width={24}
                                    height={24}
                                    alt="Google Logo"
                                ></Image>
                                Log in with Google
                            </Button>
                        </div>
                        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                            <span className="bg-card text-muted-foreground relative z-10 px-2">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-6">
                                <div className="grid gap-6">
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder=""
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
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Password{' '}
                                                    <a
                                                        href="#"
                                                        className="ml-auto text-sm underline-offset-4 hover:underline"
                                                    >
                                                        Forgot your password?
                                                    </a>
                                                </FormLabel>
                                                {''}

                                                <FormControl>
                                                    <Input
                                                        placeholder=""
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
                                        Login
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Don&apos;t have an account?{' '}
                                    <Link
                                        href="/sign-up"
                                        className="underline underline-offset-4"
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our{' '}
                <Link href="/terms-and-conditions">Terms of Service</Link> and{' '}
                <Link href="/privacy-policy">Privacy Policy</Link>.
            </div>
        </div>
    );
}
