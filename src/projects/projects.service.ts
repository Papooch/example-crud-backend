import { PrismaClient } from '@prisma/client';

import {
    getSkipAndTake,
    PaginationQuery,
    WithTotal,
} from '../common/pagination';
import { Project, ProjectCreateParams } from './project';

export class ProjectsService {
    constructor(private prisma: PrismaClient) {}

    public async getAll({
        page,
        limit,
    }: PaginationQuery): Promise<WithTotal<Project>> {
        const total = await this.prisma.project.count();
        const projects = await this.prisma.project.findMany(
            getSkipAndTake(page, limit),
        );
        return { total, items: projects };
    }

    public async getById(id: number): Promise<Project | null> {
        return await this.prisma.project.findFirst({ where: { id } });
    }

    public async create(project: ProjectCreateParams): Promise<Project> {
        return await this.prisma.project.create({ data: project });
    }

    public async update(
        id: number,
        project: Partial<ProjectCreateParams>,
    ): Promise<Project> {
        return await this.prisma.project.update({
            where: { id },
            data: project,
        });
    }
}
