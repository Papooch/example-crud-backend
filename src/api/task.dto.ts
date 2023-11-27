import { z } from 'zod';

export const CreateTaskSchema = z
    .object({
        projectId: z.number(),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
    })
    .strict();
export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;

export const ViewTaskSchema = CreateTaskSchema.extend({
    id: z.number(),
    status: z.enum(['Open', 'InProgress', 'Done']),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
}).strict();
export type ViewTaskDto = z.infer<typeof ViewTaskSchema>;
