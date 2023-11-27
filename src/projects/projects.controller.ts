import { Router, Request, Response, NextFunction } from 'express';
import { ProjectsService } from './projects.service';
import { HttpError } from '../common/errors/http-errors';
import { initServer } from '@ts-rest/express';
import { contract } from '../api/contract';
import { CreatedResponse, OkResponse } from '../common/api-responses';

export class ProjectsController {
    constructor(private projectService: ProjectsService) {}

    public router = initServer().router(contract.projects, {
        getAllProjects: async () => {
            const projects = await this.projectService.getAll();
            return OkResponse(projects);
        },
        getProjectById: async ({ params: { id } }) => {
            const project = await this.projectService.getById(id);
            if (!project) {
                throw HttpError.NotFound(`Project with id ${id} not found`);
            }
            return OkResponse(project);
        },
        createProject: async ({ body }) => {
            const project = await this.projectService.create(body);
            return CreatedResponse(project);
        },
        updateProject: async ({ params: { id }, body }) => {
            const project = await this.projectService.update(id, body);
            return OkResponse(project);
        },
    });
}
