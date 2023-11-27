import {
    PrismaClient,
    Task as PrismaTask,
    Tag as PrismaTag,
    TagOnTask as PrismaTagOnTask,
    Prisma,
} from '@prisma/client';
import { SearchTaskParams, Task, TaskCreateParams, TaskStatus } from './task';
import { RelationError } from '../common/errors/app-errors';
import {
    PaginationQuery,
    WithTotal,
    getSkipAndTake,
} from '../common/pagination';

export class TasksService {
    constructor(private prisma: PrismaClient) {}

    public async search(
        { page, limit }: PaginationQuery,
        search: SearchTaskParams,
    ): Promise<WithTotal<Task>> {
        const where: Prisma.TaskWhereInput = {};
        if (search.projectId) {
            where.projectId = search.projectId;
        }
        if (search.description) {
            where.description = { contains: search.description };
        }
        if (search.status) {
            where.status = search.status;
        }
        if (search.tags) {
            const tags = await this.prisma.tag.findMany({
                where: { name: { in: search.tags } },
            });
            where.tags = { some: { tagId: { in: tags.map((tag) => tag.id) } } };
        }
        const total = await this.prisma.task.count({ where });
        const tasks = await this.prisma.task.findMany({
            include: { tags: { include: { tag: true } } },
            where,
            ...getSkipAndTake(page, limit),
        });
        return {
            total,
            items: tasks.map(this.mapToTask),
        };
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

    public async create({
        tags,
        ...taskParams
    }: TaskCreateParams): Promise<Task> {
        const id = await this.prisma.$transaction(async (tx) => {
            const createdTask = await tx.task
                .create({
                    data: {
                        ...taskParams,
                        status: TaskStatus.Open,
                    },
                })
                .catch((err) => {
                    if (err?.code !== 'P2002') {
                        throw new RelationError(
                            `Project with id ${taskParams.projectId} deos not exist.`,
                        );
                    }
                    throw err;
                });
            await tx.tag.createMany({
                data: tags.map((tag) => ({ name: tag })),
                skipDuplicates: true,
            });
            const createdTags = await tx.tag.findMany({
                where: { name: { in: tags } },
                select: { id: true },
            });
            await tx.tagOnTask.createMany({
                data: createdTags.map((tag) => ({
                    tagId: tag.id,
                    taskId: createdTask.id,
                })),
            });
            return createdTask.id;
        });
        return (await this.getById(id)) as Task;
    }

    public async update(
        id: number,
        { tags, description }: Partial<Omit<TaskCreateParams, 'projectId'>>,
    ) {
        const existingTask = await this.getById(id);
        if (!existingTask) {
            return null;
        }
        await this.prisma.$transaction(async (tx) => {
            const updatedTask = await tx.task.update({
                where: { id },
                data: { description },
            });
            if (tags && tags.length > 0) {
                await tx.tag.createMany({
                    data: tags.map((tag) => ({ name: tag })),
                    skipDuplicates: true,
                });
                const createdTags = await tx.tag.findMany({
                    where: { name: { in: tags } },
                    select: { id: true },
                });
                await tx.tagOnTask.deleteMany({ where: { taskId: id } });
                await tx.tagOnTask.createMany({
                    data: createdTags.map((tag) => ({
                        tagId: tag.id,
                        taskId: updatedTask.id,
                    })),
                });
            }
        });
        return await this.getById(id);
    }

    public async changeStatus(id: number, status: TaskStatus) {
        const existingTask = await this.getById(id);
        if (!existingTask) {
            return null;
        }
        this.prisma.task.update({
            where: { id },
            data: {
                status,
            },
        });
        return this.getById(id);
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
