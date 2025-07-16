'use client';

import { GalleryVerticalEnd } from 'lucide-react';
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

export function OtpForm() {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const form = useForm({
        resolver: zodResolver(signupVerifySchema),
        defaultValues: {
            otp: '',
        },
        mode: 'onBlur',
    });

    async function onSubmit(values) {
        console.log(values);
        // some lib actions function
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <OtpVerification></OtpVerification>
            </form>
        </Form>
    );
}
