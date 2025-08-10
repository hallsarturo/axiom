'use client';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { userPostSchema } from '@/lib/schemas/posts';
import { publishPost } from '@/lib/actions/actions';
import { useUser } from '@/components/context/UserProfileContext';
import { useState } from 'react';

export function PublishPost(props) {
    const { user } = useUser();
    const [open, setOpen] = useState(false);
    const form = useForm({
        resolver: zodResolver(userPostSchema),
        defaultValues: {
            title: '',
            content: '',
            image: null,
        },
    });
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function onSubmit(values) {
        console.log('Form submitted!', values); // Debug line
        setIsSubmitting(true);

        let token = null;
        if (
            process.env.NODE_ENV === 'development' &&
            typeof window !== 'undefined'
        ) {
            token = localStorage.getItem('token');
        }

        try {
            const result = await publishPost(token, values);

            if (result.success) {
                toast.success('Post published!');
                setOpen(false); // Close dialog on success
                form.reset(); // Reset form fields
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
        console.log('Submit button clicked');

        // Debug validation errors
        console.log('Form errors:', form.formState.errors);
        const values = form.getValues();
        console.log('Form values:', values);

        // If there are no validation errors, call onSubmit directly
        if (Object.keys(form.formState.errors).length === 0) {
            console.log('Manually calling onSubmit with:', values);
            onSubmit(values);
        } else {
            console.log('Validation failed:', form.formState.errors);
        }
    };

    return (
        <>
            <div className={`w-full ${props.className || ''}`}>
                <Card className="max-w-[700px] m-4 p-8">
                    <div>
                        <div className="flex flex-row gap-4 mb-3 items-center sm:items-start">
                            <Avatar>
                                <AvatarImage
                                    src={user ? user.photoUrl : null}
                                />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className="flex w-full items-center justify-center">
                                <Input
                                    placeholder="Share something thoughtful"
                                    className="w-full text-sm sm:text-base cursor-pointer"
                                    onClick={() => setOpen(true)}
                                />
                            </div>
                        </div>
                        <Separator />
                        <div className="flex flex-col gap-3 mt-3 sm:flex-row items-center sm:justify-around">
                            <Dialog
                                open={open}
                                onOpenChange={(newOpen) => {
                                    if (isSubmitting) return; // Prevent closing during submission
                                    setOpen(newOpen);
                                }}
                            >
                                {/* Trigger buttons outside form */}
                                <DialogTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        className="text-xs px-3 py-1 h-8 flex items-center justify-center w-fit mb-2"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="size-6 mr-2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                            />
                                        </svg>
                                        <span>Share a post</span>
                                    </Button>
                                </DialogTrigger>

                                {/* Dialog content with form inside */}
                                <DialogContent className="flex flex-col justify-between min-h-2/3">
                                    <DialogHeader>
                                        <DialogTitle className="text-primary dark:text-foreground font-bold">
                                            Publish a Post
                                        </DialogTitle>
                                        <DialogDescription></DialogDescription>
                                    </DialogHeader>

                                    {/* Form inside the dialog content */}
                                    <Form {...form}>
                                        {/* Remove onSubmit from form element to prevent potential conflicts */}
                                        <div className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="title"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Title
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Title"
                                                                {...field}
                                                                className="w-full text-sm sm:text-base"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="content"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Content
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Content"
                                                                rows="10"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {message && (
                                                <div className="text-sm text-center py-2 text-red-500">
                                                    {message}
                                                </div>
                                            )}

                                            <DialogFooter className="flex justify-center mt-4">
                                                <Button
                                                    type="button"
                                                    onClick={handleSubmitClick}
                                                    disabled={isSubmitting}
                                                    className="w-fit"
                                                >
                                                    {isSubmitting
                                                        ? 'Posting...'
                                                        : 'Post'}
                                                </Button>
                                            </DialogFooter>
                                        </div>
                                    </Form>
                                </DialogContent>
                            </Dialog>

                            {/* Other buttons like image upload */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        className="text-xs px-3 py-1 h-8 flex items-center justify-center w-fit"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="size-6 mr-2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                            />
                                        </svg>
                                        <span>Upload an image</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="hidden md:inline-block">
                                    <p>Not available yet</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    );
}
