import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { ViewTaskSchema } from './task.dto';

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
    },
    {
        pathPrefix: '/tasks',
    },
);
