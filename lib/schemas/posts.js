import { z } from 'zod';

export const userPostSchema = z.object({
    title: z.string().min(1, 'a title is required'),
    content: z.string().optional(),
    image: z.union([z.instanceof(File), z.null(), z.undefined()]),
});

export const userPostCommentSchema = z.object({
    content: z.string().min(1, 'some comment is required'),
    //image: z.union([z.instanceof(File), z.null(), z.undefined()]),
});
