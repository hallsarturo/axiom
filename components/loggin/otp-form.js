'use client';

import { Button } from '@/components/ui/button';
import { OtpVerification } from '@/components/loggin/otp-verification';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { signupVerifySchema } from '@/lib/schemas/auth';
import { sendOtpCode } from '@/lib/actions/actions';

export function OtpForm() {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const form = useForm({
        resolver: zodResolver(signupVerifySchema),
        defaultValues: {
            otpSignup: '',
        },
        mode: 'onBlur',
    });

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    async function onSubmit(values) {
        const provisionalToken = getCookie('provisionalToken');
        const result = await sendOtpCode(values, provisionalToken);

        if (result.success) {
            document.cookie = `token=${result.data.token}; path=/; secure; samesite=strict`;
            router.push('/dashboard');
        } else {
            setMessage(`Loggin failed: ${result.error}`);
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                    <FormField
                        control={form.control}
                        name="otpSignup"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel></FormLabel>
                                <FormControl>
                                    <OtpVerification
                                        id="otpSignup"
                                        type="text"
                                        inputMode="numeric"
                                        pattern="\d*"
                                        {...field}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                form.handleSubmit(onSubmit)();
                                            }
                                            if (field.onKeyDown)
                                                field.onKeyDown(e);
                                        }}
                                    ></OtpVerification>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    ></FormField>
                    {message && (
                        <div className="text-sm text-center py-2 text-red-500">
                            {message}
                        </div>
                    )}
                    <Button type="submit" className="gap-4">
                        Submit code
                    </Button>
                </div>
            </form>
        </Form>
    );
}
