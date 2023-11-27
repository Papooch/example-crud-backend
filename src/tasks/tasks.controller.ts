import { Router, Request, Response, NextFunction } from 'express';
import { HttpError } from '../common/errors/http-errors';
import { TasksRepository } from './tasks.repository';

export class TasksController {
    constructor(private tasksRepository: TasksRepository) {}

    configureRoutes(router: Router) {
        router.get('', this.getAllTasks.bind(this));
        router.get(
            '/by-project/:projectId',
            this.getAllTasksByProjectId.bind(this),
        );
        router.get('/:id', this.getOneById.bind(this));
        return router;
    }

    private getOneById(req: Request, res: Response) {
        const id = parseInt(req.params.id, 10);
        const task = this.tasksRepository.getById(id);
        if (!task) {
            throw HttpError.NotFound(`Task with id ${id} not found`);
        }
        return res.json(task);
    }

    private getAllTasksByProjectId(req: Request, res: Response) {
        const id = parseInt(req.params.projectId, 10);
        const tasks = this.tasksRepository.getById(id);

        return res.json(tasks);
    }

    private getAllTasks(req: Request, res: Response) {
        const projects = this.tasksRepository.getAll();
        res.json(projects);
    }
}
