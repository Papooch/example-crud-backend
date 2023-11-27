import { PrismaClient } from '@prisma/client';
import { Project } from './project';

export class ProjectsService {
    constructor(private prisma: PrismaClient) {}

    public async getAll(): Promise<Project[]> {
        return await this.prisma.project.findMany();
    }

    public async getById(id: number): Promise<Project | null> {
        return await this.prisma.project.findFirst({ where: { id } });
    }
}
