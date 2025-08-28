'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { userPostCommentSchema } from '@/lib/schemas/posts';
// create post action
import { useUser } from '@/components/context/UserProfileContext';
import { useState } from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export function PostCardCommentForm() {
    return (
        <div className="flex w-full ">
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>Comment Form</div>
        </div>
    );
}
