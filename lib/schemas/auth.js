import { z } from 'zod';
import parsePhoneNumber from 'libphonenumber-js';

export const loginFormSchema = z.object({
    username: z
        .string()
        .min(6, {
            message: 'username must be at least 6 characters',
        })
        .max(50, {
            message: 'Password must be at most 50 characters',
        })
        .refine((val) => val === val.toLowerCase(), {
            message: 'Username must be lowercase',
        }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 character' })
        .max(50, {
            message: 'Password must be at most 50 characters',
        }),
});

export const signupFormSchema = z
    .object({
        username: z
            .string()
            .min(6, {
                message: 'username must be at least 6 character',
            })
            .max(50, {
                message: 'Password must be at most 50 characters',
            })
            .refine((val) => val === val.toLowerCase(), {
                message: 'Username must be lowercase',
            }),
        email: z.email({ message: 'Invalid email address' }),
        mobilePhone: z
            .string()
            .refine(
                (value) => {
                    const phone = parsePhoneNumber(value);
                    return phone?.isValid() ?? false;
                },
                {
                    message: 'Invalid phone number',
                }
            )
            .transform((value) => {
                const phone = parsePhoneNumber(value);
                return phone?.number ?? value;
            }),
        password: z
            .string()
            .min(6, { message: 'Password must be at least 6 character' })
            .max(50, {
                message: 'Password must be at most 50 characters',
            }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });
