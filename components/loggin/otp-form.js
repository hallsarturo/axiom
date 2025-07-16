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

    async function onSubmit(values) {
        console.log('values: ', values);
        const result = await sendOtpCode(values);
        
        if (result.success) {
            localStorage.setItem('token', result.data.token);
            router.push('/feed');
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
                    <Button type="submit" className="gap-4">
                        Submit code
                    </Button>
                </div>
            </form>
        </Form>
    );
}
