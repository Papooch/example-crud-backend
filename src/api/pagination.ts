import { z } from 'zod';

export const PaginationQuerySchema = z
    .object({
        page: z.coerce.number().default(1),
        limit: z.coerce.number().default(10),
    })
    .strict();

export const paginatedResponseSchema = <T extends z.ZodType<any>>(schema: T) =>
    z.object({
        items: z.array(schema),
        total: z.number(),
        page: z.number(),
        limit: z.number(),
    });
