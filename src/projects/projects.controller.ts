import { Router, Request, Response, NextFunction } from 'express';
import { ProjectsRepository } from './projects.repository';
import { HttpError } from '../common/errors/http-errors';

export class ProjectsController {
    constructor(private projectsRepository: ProjectsRepository) {}

    configureRoutes(router: Router) {
        router.get('', this.getAllProjects.bind(this));
        router.get('/:id', this.getOneById.bind(this));
        return router;
    }

    private getOneById(req: Request, res: Response) {
        const id = parseInt(req.params.id, 10);
        const project = this.projectsRepository.getById(id);
        if (!project) {
            throw HttpError.NotFound(`Project with id ${id} not found`);
        }
        return res.json(project);
    }

    private getAllProjects(req: Request, res: Response) {
        const projects = this.projectsRepository.getAll();
        res.json(projects);
    }
}
