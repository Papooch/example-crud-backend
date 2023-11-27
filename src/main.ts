import express, { ErrorRequestHandler, Router } from 'express';
import { ProjectsRepository } from './projects/projects.repository';
import { ProjectsController } from './projects/projects.controller';
import { HttpError } from './common/errors/http-errors';
import { TasksRepository } from './tasks/tasks.repository';
import { TasksController } from './tasks/tasks.controller';
import bodyParser from 'body-parser';
import { createExpressEndpoints, initServer } from '@ts-rest/express';
import { contract } from './api/contract';

async function bootstrap() {
    const app = express();
    const port = 3000;

    const projectsRepository = new ProjectsRepository();
    const projectsController = new ProjectsController(projectsRepository);

    const tasksRepository = new TasksRepository();
    const tasksController = new TasksController(tasksRepository);

    const s = initServer();
    const router = s.router(contract, {
        projects: projectsController.router,
        tasks: tasksController.router,
    });

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    createExpressEndpoints(contract, router, app);

    app.use(((err, req, res, next) => {
        if (err instanceof HttpError) {
            return res.status(err.status).json({
                status: err.status,
                message: err.message,
            });
        }
        return res.status(500).json({
            message: err.message,
        });
    }) as ErrorRequestHandler);

    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
}

void bootstrap();
