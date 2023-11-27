import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { CreateTaskSchema, ViewTaskSchema } from './task.dto';
import { TaskStatus } from '../tasks/task';

const c = initContract();

export const tasksContract = c.router(
    {
        getAllTasks: {
            method: 'GET',
            path: '',
            responses: {
                200: z.array(ViewTaskSchema),
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
        getTasksByProjectId: {
            method: 'GET',
            path: '/project/:projectId',
            pathParams: z.object({
                projectId: z.coerce.number(),
            }),
            responses: {
                200: z.array(ViewTaskSchema),
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
