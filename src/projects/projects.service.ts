import { PrismaClient } from '@prisma/client';
import { Project, ProjectCreateParams } from './project';

export class ProjectsService {
    constructor(private prisma: PrismaClient) {}

    public async getAll(): Promise<Project[]> {
        return await this.prisma.project.findMany();
    }

    public async getById(id: number): Promise<Project | null> {
        return await this.prisma.project.findFirst({ where: { id } });
    }

    public async create(project: ProjectCreateParams): Promise<Project> {
        console.log(project);
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
