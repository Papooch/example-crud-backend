import { Task, TaskStatus } from './task';

export class TasksRepository {
    private tasks: Task[] = [
        {
            id: 1,
            projectId: 1,
            description: 'This is a test Task',
            status: TaskStatus.Open,
            tags: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    public getAll(): Task[] {
        return this.tasks;
    }

    public getAllByProjectId(projectId: number): Task[] {
        return this.tasks.filter((task) => task.projectId === projectId);
    }

    public getById(id: number): Task | undefined {
        return this.tasks.find((project) => project.id === id);
    }
}
