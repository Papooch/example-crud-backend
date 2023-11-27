import { Project } from './project';

export class ProjectsRepository {
    private projects: Project[] = [
        {
            id: 1,
            title: 'Test Project',
            description: 'This is a test project',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    public getAll(): Project[] {
        return this.projects;
    }

    public getById(id: number): Project | undefined {
        return this.projects.find((project) => project.id === id);
    }
}
