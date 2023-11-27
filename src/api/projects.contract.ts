import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { CreateProjectSchema, ViewProjectSchema } from './project.dto';

const c = initContract();

export const projectsContract = c.router(
    {
        getAllProjects: {
            method: 'GET',
            path: '',
            responses: {
                200: z.array(ViewProjectSchema),
            },
        },
        getProjectById: {
            method: 'GET',
            path: '/:id',
            pathParams: z.object({
                id: z.coerce.number(),
            }),
            responses: {
                200: ViewProjectSchema,
            },
        },
        createProject: {
            method: 'POST',
            path: '',
            body: CreateProjectSchema,
            responses: {
                201: ViewProjectSchema,
            },
        },
        updateProject: {
            method: 'PUT',
            path: '/:id',
            pathParams: z.object({
                id: z.coerce.number(),
            }),
            body: CreateProjectSchema.partial(),
            responses: {
                200: ViewProjectSchema,
            },
        },
    },
    {
        pathPrefix: '/projects',
    },
);
