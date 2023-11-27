import { z } from 'zod';

export const CreateProjectSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
});
export type CreateProjectDto = z.infer<typeof CreateProjectSchema>;

export const ViewProjectSchema = CreateProjectSchema.extend({
    id: z.number(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});
export type ViewProjectDto = z.infer<typeof ViewProjectSchema>;
