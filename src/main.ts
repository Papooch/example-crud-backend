import { PrismaClient } from '@prisma/client';
import { createExpressEndpoints, initServer } from '@ts-rest/express';
import { generateOpenApi } from '@ts-rest/open-api';
import bodyParser from 'body-parser';
import express, { ErrorRequestHandler, Express } from 'express';
import * as swaggerUi from 'swagger-ui-express';

import { contract } from './api/contract';
import { AppError } from './common/errors/app-errors';
import { HttpError } from './common/errors/http-errors';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsService } from './projects/projects.service';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';

async function bootstrap() {
    const app = express();
    const port = 3000;

    resolveDependencies(app);
    bindErrorHandlers(app);
    serveDocumentation(app);

    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
}

function resolveDependencies(app: Express) {
    const prisma = new PrismaClient();

    const projectsRepository = new ProjectsService(prisma);
    const projectsController = new ProjectsController(projectsRepository);

    const tasksRepository = new TasksService(prisma);
    const tasksController = new TasksController(tasksRepository);

    const s = initServer();
    const router = s.router(contract, {
        projects: projectsController.router,
        tasks: tasksController.router,
    });

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    createExpressEndpoints(contract, router, app);
}

function bindErrorHandlers(app: Express) {
    app.use(((err, _req, _res, next) => {
        if (err instanceof AppError) {
            next(HttpError.fromAppError(err));
        }
        next(HttpError.Internal(err));
    }) as ErrorRequestHandler);
    app.use(((err: HttpError, _req, res, _next) => {
        return res.status(err.status).json({
            status: err.status,
            message: err.message,
        });
    }) as ErrorRequestHandler);
}

function serveDocumentation(app: Express) {
    const openApiDocument = generateOpenApi(
        contract,
        {
            info: {
                title: 'Tasks API',
                version: '1.0.0',
            },
        },
        {
            setOperationId: true,
        },
    );

    app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(openApiDocument));
}

void bootstrap();
