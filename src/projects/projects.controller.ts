import { initServer } from '@ts-rest/express';

import { contract } from '../api/contract';
import { CreatedResponse, OkResponse } from '../common/api-responses';
import { HttpError } from '../common/errors/http-errors';
import { ProjectsService } from './projects.service';

export class ProjectsController {
    constructor(private projectService: ProjectsService) {}

    public router = initServer().router(contract.projects, {
        getAllProjects: async ({ query: { page, limit } }) => {
            const { total, items } = await this.projectService.getAll({
                page,
                limit,
            });
            return OkResponse({ page, limit, total, items });
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
