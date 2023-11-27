import { Tag } from './tag';

export enum TaskStatus {
    Open = 'Open',
    InProgress = 'InProgress',
    Done = 'Done',
}

export interface Task {
    id: number;
    projectId: number;
    description: string;
    status: TaskStatus;
    tags: Tag[];
    createdAt: Date;
    updatedAt: Date;
}
