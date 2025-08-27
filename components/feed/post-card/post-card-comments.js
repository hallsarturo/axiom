'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FaRegComment } from 'react-icons/fa';

export function Comments() {
    return (
        <Dialog>
            <DialogTrigger>
                <Button
                    variant="ghost"
                    className="text-primary dark:text-foreground"
                >
                    <FaRegComment className="size-5.5" />
                    Comment
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl w-full md:max-h-[800px] sm:min-w-[650px] md:min-w-[680px] flex flex-col h-full">
                <DialogHeader>
                    <DialogTitle className="flex justify-center text-primary dark:text-foreground text-center">
                        Share your thoughts
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
