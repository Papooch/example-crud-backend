import { z } from 'zod';
import { TaskStatus } from '../tasks/task';

export const CreateTaskSchema = z
    .object({
        projectId: z.number(),
        description: z.string(),
        tags: z.array(z.string()).max(100),
    })
    .strict();
export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;

export const ViewTaskSchema = CreateTaskSchema.extend({
    id: z.number(),
    status: z.nativeEnum(TaskStatus),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
}).strict();
export type ViewTaskDto = z.infer<typeof ViewTaskSchema>;
