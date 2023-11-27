import {
    PrismaClient,
    Task as PrismaTask,
    Tag as PrismaTag,
    TagOnTask as PrismaTagOnTask,
} from '@prisma/client';
import { Task, TaskStatus } from './task';

export class TasksService {
    constructor(private prisma: PrismaClient) {}

    public async getAll(): Promise<Task[]> {
        const tasks = await this.prisma.task.findMany({
            include: { tags: { include: { tag: true } } },
        });
        return tasks.map(this.mapToTask);
    }

    public async getAllByProjectId(projectId: number): Promise<Task[]> {
        const tasks = await this.prisma.task.findMany({
            where: { projectId },
            include: { tags: { include: { tag: true } } },
        });

        return tasks.map(this.mapToTask);
    }

    public async getById(id: number): Promise<Task | null> {
        const task = await this.prisma.task.findFirst({
            where: { id },
            include: { tags: { include: { tag: true } } },
        });
        if (!task) {
            return null;
        }
        return this.mapToTask(task);
    }

    private mapToTask(
        task: PrismaTask & { tags: (PrismaTagOnTask & { tag: PrismaTag })[] },
    ): Task {
        return {
            ...task,
            tags: task.tags.map((tag) => tag.tag.name),
            status: task.status as TaskStatus,
        };
    }
}
