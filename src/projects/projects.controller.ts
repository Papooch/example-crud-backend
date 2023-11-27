import { Router, Request, Response, NextFunction } from 'express';
import { ProjectsRepository } from './projects.repository';
import { HttpError } from '../common/errors/http-errors';
import { initServer } from '@ts-rest/express';
import { contract } from '../api/contract';

export class ProjectsController {
    constructor(private projectsRepository: ProjectsRepository) {}

    public router = initServer().router(contract.projects, {
        getAllProjects: async () => {
            const projects = this.projectsRepository.getAll();
            return {
                status: 200,
                body: projects,
            };
        },
        getProjectById: async ({ params }) => {
            const id = params.id;
            const project = this.projectsRepository.getById(id);
            if (!project) {
                throw HttpError.NotFound(`Project with id ${id} not found`);
            }
            return {
                status: 200,
                body: project,
            };
        },
    });
}
