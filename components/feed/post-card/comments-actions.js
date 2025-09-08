'use cient';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { deleteComment } from '@/lib/actions/actions';
import { useCommentsStore } from '@/lib/state/commentsStore';

export function CommentsActions({
    commentId,
    postId,
    userId,
    parentPage = 1,
    pageSize = 20,
}) {
    // Get store functions
    const { fetchParentComments } = useCommentsStore();

    // Delete comment handler
    async function handleDeleteComment() {
        let token = null;
        if (
            process.env.NODE_ENV === 'development' &&
            typeof window !== 'undefined'
        ) {
            token = localStorage.getItem('token');
        }

        try {
            const result = await deleteComment(token, commentId);
            if (result.success) {
                toast.success('Comment deleted!');
                // Refresh comments in the store to update UI immediately
                await fetchParentComments(postId, parentPage, pageSize, userId);
            } else {
                // Show backend error if available
                const errorMsg =
                    result.error ||
                    'Failed to delete comment. Please try again.';
                toast.error(errorMsg);
            }
        } catch (err) {
            toast.error('Something went wrong');
            console.error('deleteComment err: ', err);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
                <div className="flex-shrink-0">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                        />
                    </svg>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>
                    Delete
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="link"
                                className="cursor-pointer"
                                size="xs"
                            ></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Delete comment. Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteComment}
                                >
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuItem>
                <DropdownMenuItem>Report</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
