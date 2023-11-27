import { z } from 'zod';

export const CreateProjectSchema = z
    .object({
        title: z.string(),
        description: z.string(),
    })
    .strict();
export type CreateProjectDto = z.infer<typeof CreateProjectSchema>;

export const ViewProjectSchema = CreateProjectSchema.extend({
    id: z.number(),
    createdAt: z.date().optional().nullable(),
    updatedAt: z.date().optional().nullable(),
}).strict();
export type ViewProjectDto = z.infer<typeof ViewProjectSchema>;
