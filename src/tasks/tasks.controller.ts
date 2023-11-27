import { Router, Request, Response, NextFunction } from 'express';
import { HttpError } from '../common/errors/http-errors';
import { TasksRepository } from './tasks.repository';

import { initServer } from '@ts-rest/express';
import { contract } from '../api/contract';
import { Task } from './task';
import { ViewTaskDto } from '../api/task.dto';

export class TasksController {
    constructor(private tasksRepository: TasksRepository) {}

    public router = initServer().router(contract.tasks, {
        getAllTasks: async () => {
            const tasks = this.tasksRepository.getAll();
            return {
                status: 200,
                body: tasks.map(this.mapTaskToView),
            };
        },
        getTaskById: async ({ params }) => {
            const id = params.id;
            const task = this.tasksRepository.getById(id);
            if (!task) {
                throw HttpError.NotFound(`Task with id ${id} not found`);
            }
            return {
                status: 200,
                body: this.mapTaskToView(task),
            };
        },
        getTasksByProjectId: async ({ params }) => {
            const id = params.projectId;
            const tasks = this.tasksRepository.getAllByProjectId(id);
            if (!tasks) {
                throw HttpError.NotFound(
                    `Tasks with projectId ${id} not found`,
                );
            }
            return {
                status: 200,
                body: tasks.map(this.mapTaskToView),
            };
        },
    });

    private mapTaskToView(task: Task): ViewTaskDto {
        return {
            id: task.id,
            projectId: task.projectId,
            description: task.description,
            status: task.status,
            tags: task.tags.map((tag) => tag.name),
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
        };
    }
}
