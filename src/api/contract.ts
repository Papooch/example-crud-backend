import { initContract } from '@ts-rest/core';

import { projectsContract } from './projects.contract';
import { tasksContract } from './tasks.contract';

const c = initContract();

export const contract = c.router({
    projects: projectsContract,
    tasks: tasksContract,
});
