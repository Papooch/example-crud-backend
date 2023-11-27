import { Router, Request, Response, NextFunction } from 'express';
import { ProjectsService } from './projects.service';
import { HttpError } from '../common/errors/http-errors';
import { initServer } from '@ts-rest/express';
import { contract } from '../api/contract';

export class ProjectsController {
    constructor(private projectService: ProjectsService) {}

    public router = initServer().router(contract.projects, {
        getAllProjects: async () => {
            const projects = await this.projectService.getAll();
            return {
                status: 200,
                body: projects,
            };
        },
        getProjectById: async ({ params }) => {
            const id = params.id;
            const project = await this.projectService.getById(id);
            if (!project) {
                throw HttpError.NotFound(`Project with id ${id} not found`);
            }
            return {
                status: 200,
                body: project,
            };
        },
        createProject: async ({ body }) => {
            const project = await this.projectService.create(body);
            return {
                status: 201,
                body: project,
            };
        },
        updateProject: async ({ params, body }) => {
            const id = params.id;
            const project = await this.projectService.update(id, body);
            return {
                status: 200,
                body: project,
            };
        },
    });
}
