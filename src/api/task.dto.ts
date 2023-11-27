import { z } from 'zod';

import { TaskStatus } from '../tasks/task';

export const CreateTaskSchema = z
    .object({
        projectId: z.number(),
        description: z.string(),
        tags: z.preprocess(
            // ensure we have an array (needed due to how query array params are handled)
            (obj) => (typeof obj === 'string' ? [obj] : obj),
            z.array(z.string()).max(100),
        ),
    })
    .strict();

export const ViewTaskSchema = CreateTaskSchema.extend({
    id: z.number(),
    status: z.nativeEnum(TaskStatus),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
}).strict();

export const SearchTackSchema = ViewTaskSchema.pick({
    description: true,
    projectId: true,
    status: true,
    tags: true,
}).partial();
