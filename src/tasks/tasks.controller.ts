import { HttpError } from '../common/errors/http-errors';
import { TasksService } from './tasks.service';
import { initServer } from '@ts-rest/express';
import { contract } from '../api/contract';
import { CreatedResponse, OkResponse } from '../common/api-responses';

export class TasksController {
    constructor(private tasksService: TasksService) {}

    public router = initServer().router(contract.tasks, {
        getAllTasks: async ({ query: { page, limit } }) => {
            const { items, total } = await this.tasksService.getAll({
                page,
                limit,
            });
            return OkResponse({ page, limit, total, items });
        },
        getTaskById: async ({ params: { id } }) => {
            const task = await this.tasksService.getById(id);
            if (!task) {
                throw HttpError.NotFound(`Task with id ${id} not found`);
            }
            return OkResponse(task);
        },
        getTasksByProjectId: async ({
            params: { projectId },
            query: { page, limit },
        }) => {
            const { items, total } = await this.tasksService.getAllByProjectId(
                projectId,
                { page, limit },
            );
            if (!items) {
                throw HttpError.NotFound(
                    `Tasks with projectId ${projectId} not found`,
                );
            }
            return OkResponse({ page, limit, total, items });
        },
        createTask: async ({ body }) => {
            const task = await this.tasksService.create(body);
            return CreatedResponse(task);
        },
        updateTask: async ({ params: { id }, body }) => {
            const task = await this.tasksService.update(id, body);
            if (!task) {
                throw HttpError.NotFound(`Task with id ${id} not found`);
            }
            return OkResponse(task);
        },
        updateTaskStatus: async ({ params: { id }, body }) => {
            const status = body.status;
            const task = await this.tasksService.changeStatus(id, status);
            if (!task) {
                throw HttpError.NotFound(`Task with id ${id} not found`);
            }
            return OkResponse(task);
        },
    });
}
