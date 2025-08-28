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
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { userPostSchema } from '@/lib/schemas/posts';
import { publishPost } from '@/lib/actions/actions';
import { useUser } from '@/components/context/UserProfileContext';
import { useState } from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const ACCEPTED_FORMATS = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
const MAX_IMAGE_SIZE_MB = 1;

export function PublishPost({ mutateFeed, onDialogOpenChange, ...props }) {
    const requireAuth = useRequireAuth();
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
                //toast.success('Post published!');
                setOpen(false); // Close dialog on success
                form.reset(); // Reset form fields
                if (mutateFeed && result.data?.post) {
                    mutateFeed(result.data?.post); // <-- This triggers SWR to re-fetch the feed
                }
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
        const result = userPostSchema.safeParse(values);

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

    // Dropzone setup
    const { getRootProps, getInputProps, acceptedFiles, isDragActive } =
        useDropzone({
            accept: ACCEPTED_FORMATS.reduce((acc, type) => {
                acc[type] = [];
                return acc;
            }, {}),
            maxFiles: 1,
            onDrop: (files) => {
                const file = files[0];
                if (!file) return;
                if (!ACCEPTED_FORMATS.includes(file.type)) {
                    setMessage(
                        'Invalid image format. Allowed: PNG, JPG, JPEG, GIF'
                    );
                    form.setValue('image', null);
                    return;
                }
                if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
                    setMessage('Image size must be less than 1MB');
                    form.setValue('image', null);
                    return;
                }
                setMessage('');
                form.setValue('image', file);
            },
        });

    return (
        <div className="min-w-full sm:min-w-[680px]">
            <div className={`${props.className || ''}`}>
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
                                    onClick={(e) => {
                                        if (!requireAuth()) {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            return;
                                        } else {
                                            setOpen(true);
                                            if (onDialogOpenChange)
                                                onDialogOpenChange(true);
                                        }
                                    }}
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
                                    if (onDialogOpenChange)
                                        onDialogOpenChange(newOpen);
                                }}
                            >
                                {/* Trigger buttons outside form */}
                                <DialogTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        className="text-xs px-3 mt-2 py-1 h-8 flex items-center justify-center w-fit mb-2"
                                        disabled={true}
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
                                        <span>Upload a paper</span>
                                    </Button>
                                </DialogTrigger>

                                {/* Dialog content with form inside */}
                                <DialogContent className="flex flex-col items-center min-h-2/3">
                                    <DialogHeader>
                                        <DialogTitle className="text-primary dark:text-foreground font-bold">
                                            Publish a Post
                                        </DialogTitle>
                                        <DialogDescription></DialogDescription>
                                    </DialogHeader>

                                    {/* Form inside the dialog content */}
                                    <Form {...form}>
                                        {/* Remove onSubmit from form element to prevent potential conflicts */}
                                        <div className="flex flex-col w-full justify-center space-y-4">
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
                                                                className="resize-none"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="image"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Image
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div
                                                                {...getRootProps()}
                                                                className={`flex border-2 border-dashed rounded p-4 w-full cursor-pointer gap-4 ${
                                                                    isDragActive
                                                                        ? 'border-blue-400 bg-blue-50'
                                                                        : 'border-gray-300'
                                                                }`}
                                                            >
                                                                <input
                                                                    {...getInputProps()}
                                                                />
                                                                {field.value ? (
                                                                    <div className="flex items-center gap-2 text-sm">
                                                                        <span>
                                                                            Selected:{' '}
                                                                            {
                                                                                field
                                                                                    .value
                                                                                    .name
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-sm text-gray-500">
                                                                        Drag &
                                                                        drop an
                                                                        image
                                                                        here, or
                                                                        click to
                                                                        select
                                                                    </div>
                                                                )}
                                                                <Button
                                                                    type="button"
                                                                    variant="secondary"
                                                                    size="sm"
                                                                    className="text-xs"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        form.setValue(
                                                                            'image',
                                                                            null
                                                                        );
                                                                    }}
                                                                >
                                                                    Remove
                                                                </Button>
                                                            </div>
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
        </div>
    );
}
