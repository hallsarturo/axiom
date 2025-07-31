import { z } from 'zod';

export const configFormSchema = z.object({
    about: z.string().max(1000).optional(), // Text area, optional, max length 1000 (adjust as needed)
    degreeLevel: z.enum(['enthusiast', 'student', 'researcher-profesor'], {
        required_error: 'Degree level is required',
    }),
    categories: z.array(z.number()).min(2, 'Select at least 2 categories'),
});
