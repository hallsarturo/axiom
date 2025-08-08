import { z } from 'zod';

export const userPostSchema = z.object({
    title: z.string().min(1, 'a title is required'),
    content: z.string().optional(),
    image: z.string().optional(),
});
