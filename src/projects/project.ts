export interface Project {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProjectCreateParams
    extends Omit<Project, 'id' | 'createdAt' | 'updatedAt'> {}
