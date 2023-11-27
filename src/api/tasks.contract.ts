import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { CreateTaskSchema, SearchTackSchema, ViewTaskSchema } from './task.dto';
import { TaskStatus } from '../tasks/task';
import { PaginationQuerySchema, paginatedResponseSchema } from './pagination';

const c = initContract();

export const tasksContract = c.router(
    {
        searchTasks: {
            method: 'GET',
            path: '',
            query: z.object({
                ...SearchTackSchema.shape,
                ...PaginationQuerySchema.shape,
            }),
            responses: {
                200: paginatedResponseSchema(ViewTaskSchema),
            },
        },
        getTaskById: {
            method: 'GET',
            path: '/:id',
            pathParams: z.object({
                id: z.coerce.number(),
            }),
            responses: {
                200: ViewTaskSchema,
            },
        },
        createTask: {
            method: 'POST',
            path: '',
            body: CreateTaskSchema,
            responses: {
                201: ViewTaskSchema,
            },
        },
        updateTask: {
            method: 'PUT',
            path: '/:id',
            pathParams: z.object({
                id: z.coerce.number(),
            }),
            body: CreateTaskSchema.partial(),
            responses: {
                200: ViewTaskSchema,
            },
        },
        updateTaskStatus: {
            method: 'PUT',
            path: '/:id/status',
            pathParams: z.object({
                id: z.coerce.number(),
            }),
            body: z.object({
                status: z.nativeEnum(TaskStatus),
            }),
            responses: {
                200: ViewTaskSchema,
            },
        },
    },
    {
        pathPrefix: '/tasks',
    },
);
