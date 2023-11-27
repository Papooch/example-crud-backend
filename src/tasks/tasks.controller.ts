import { Router, Request, Response, NextFunction } from 'express';
import { HttpError } from '../common/errors/http-errors';
import { TasksService } from './tasks.service';

import { initServer } from '@ts-rest/express';
import { contract } from '../api/contract';
import { Task } from './task';
import { ViewTaskDto } from '../api/task.dto';

export class TasksController {
    constructor(private tasksService: TasksService) {}

    public router = initServer().router(contract.tasks, {
        getAllTasks: async () => {
            const tasks = await this.tasksService.getAll();
            return {
                status: 200,
                body: tasks,
            };
        },
        getTaskById: async ({ params }) => {
            const id = params.id;
            const task = await this.tasksService.getById(id);
            if (!task) {
                throw HttpError.NotFound(`Task with id ${id} not found`);
            }
            return {
                status: 200,
                body: task,
            };
        },
        getTasksByProjectId: async ({ params }) => {
            const id = params.projectId;
            const tasks = await this.tasksService.getAllByProjectId(id);
            if (!tasks) {
                throw HttpError.NotFound(
                    `Tasks with projectId ${id} not found`,
                );
            }
            return {
                status: 200,
                body: tasks,
            };
        },
    });
}
