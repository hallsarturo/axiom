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
import { Forward } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { userPostCommentSchema } from '@/lib/schemas/posts';
import { publishComment } from '@/lib/actions/actions';
import { useUser } from '@/components/context/UserProfileContext';
import { useState } from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export function PostCardCommentForm({ ...props }) {
    const requireAuth = useRequireAuth();
    const postId = props.postId;
    const [isDisabled, setIsDisabled] = useState(false);
    const { user } = useUser();
    const form = useForm({
        resolver: zodResolver(userPostCommentSchema),
        defaultValues: {
            content: '',
        },
    });
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function onSubmit(values) {
        // console.log('Form submitted!', values); // Debug line
        setIsSubmitting(true);

        let token = null;
        if (
            process.env.NODE_ENV === 'development' &&
            typeof window !== 'undefined'
        ) {
            token = localStorage.getItem('token');
        }

        try {
            const result = await publishComment(token, postId, values);

            if (result.success) {
                form.reset(); // Reset form fields
                // if (mutateFeed && result.data?.post) {
                //     mutateFeed(result.data?.post); //
                // }
            } else {
                toast.error('Error posting');
                setMessage(`Posting failed: ${result.error}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Unexpected error occurred');
            setMessage('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    }

    // Handle form submission manually with better debugging
    const handleSubmitClick = async () => {
        setMessage('');
        const values = form.getValues();
        const result = userPostCommentSchema.safeParse(values);

        if (!result.success) {
            setMessage(result.error.issues[0].message); // Show first error
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(values);
        } catch (err) {
            setMessage('Posting failed: ' + err?.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex w-full gap-2">
            <Avatar>
                <AvatarImage
                    src={
                        user ? user.userProfilePic || user.photoUrl : undefined
                    }
                />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="w-full mr-2">
                <Form {...form}>
                    <div className="flex w-full">
                        <FormField
                            className="w-full"
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem className="relative w-full">
                                    <FormControl>
                                        <Textarea
                                            disabled={isDisabled}
                                            placeholder="Comment"
                                            rows="2"
                                            {...field}
                                            className="w-full pr-16 resize-none bg-muted min-h-[3rem] max-h-[calc(50vh-2rem)] overflow-y-auto"
                                            style={{
                                                height: 'auto',
                                                minHeight: '3rem',
                                            }}
                                            onClick={(e) => {
                                                if (!requireAuth()) {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setIsDisabled(true);
                                                    return;
                                                }
                                            }}
                                            onInput={(e) => {
                                                // Auto-resize textarea based on content
                                                e.target.style.height = 'auto';
                                                e.target.style.height =
                                                    Math.min(
                                                        e.target.scrollHeight,
                                                        window.innerHeight *
                                                            0.5 -
                                                            32
                                                    ) + 'px';
                                            }}
                                        ></Textarea>
                                    </FormControl>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handleSubmitClick}
                                        disabled={isSubmitting}
                                        size="sm"
                                        className="absolute bottom-0 right-2 hover:bg-transparent"
                                    >
                                        <Forward className="size-6 text-primary dark:text-primary-foreground mb-2 mr-1" />
                                    </Button>
                                </FormItem>
                            )}
                        >
                            {message && (
                                <div className="text-sm text-center py-2 text-red-500">
                                    {message}
                                </div>
                            )}
                        </FormField>
                    </div>
                </Form>
            </div>
        </div>
    );
}
