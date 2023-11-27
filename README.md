# Example CRUD backend

Example CRUD backend built with `express`, `ts-rest` and `prisma`.

## Requirements

-   The task is to build a simple CRUD backend for managing "tasks" on "projects"
-   Each task must be assigned to a project and can be in 3 states - _Open_, _In Progress_ and _Done_.
-   Each task can also be assigned from 0 to 100 tags
-   The properties of a project are: `title`, `description` and dates for `createdAt` and `updatedAt`
-   The properties for a task are: `projectId`, `description`, `state`, `tags` `createdAt` and `updatedAt`
-   The API needs to be able to CRUD projects and tasks, while also being able to filter tasks by state and tags with pagination.
-   The API should be documented
-   The database should be Postgres and the backend should be written in ExpressJS.

## Decisions made

### Language

TypeScript, there's no argument here.

### API

The requirement was to document the API, so I chose to use `ts-rest` to generate the API documentation and the API itself. This way, the API is always up to date with the documentation and is end-to-end type safe.

If there was no requirement for Express, I would have used the NestJS framework, which offers a lot of features out of the box, including API documentation and dependency injection.

### ORM

I chose `prisma` because it's the most modern and type safe ORM for TypeScript. The main advantage is it's schema-first design, which also allows to automatic generation of database migrations.

For more complex queries, I would have used a query builder like `knex` or `kysely`. The disadvantage of those is that they don't include a migration engine, which is essential for ease of use.

### Architecture/Design patterns

I chose grouping by feature, while using a layered architecture within each feature. This way, the code is easier to navigate and the dependencies are easier to manage.

I also implemented dependency injection (with manual resolution of dependencies in `main.ts`), which allows for easier testing and better separation of concerns.

You can also notice a lot of "duplication" when it comes to entity types - there is one for the Database, the API and the application. This is intentional as is allows for independent evolution of each layer, while only requiring a simple mapping between the layers.

### Testing

There are no tests yet (there is really no business logic for test), but I would have used `jest` for both unit and integration tests. Having designed the application with IoC in mind, it would be easy to mock the dependencies and test the application in isolation.

### Not implemented

For the lack of time, there is no `Delete` logic at all. I would have implemented a soft delete, where the entity is not deleted from the database, but marked as deleted (using a new `deletedAt` column). This way, the entity can be restored if needed.

### Possible improvements

The error handling could be improved. Right now, there is some basic separation between Application and API errors with a simple translation between them using a simple error handler. More exception cases could be handled with some recovery logic.

There is no authentication or authorization. I would have used `passport` for authentication and `casl` for authorization. Or more likely a managed solution like `Auth0` or `Keycloak`.

No logging is implemented. I would have used `pino` for logging. As for traces and telemetry, I would have used `opentelemety`, which plays nicely with the `pino` logger.

The API documentation is served using the ugly `swagger-ui-express`. I would have used my favourite documentation tool - [RapiDoc](https://rapidocweb.com/), which makes a better use of screen real estate, while also being more visually appealing, but needs a bit more configuration.

### Time spent

I spent around 5 hours on the project, including the initialization, experimenting with `ts-rest` and documentation, with the actual implementation taking around 3 hours.

# Development & Deployment

## Dependencies

The project requires `node` and `yarn` to be installed.

To run the development database you need `docker` and `docker-compose`.

## Install

The project is managed with `yarn`. To install the dependencies run:

```bash
yarn install
```

## Develop

Copy the `.env.example` file to `.env` and fill the variables.

Run the development database with:

```bash
docker compose up -d
```

Run database migrations with `prisma`:

```bash
yarn prisma migrate dev
```

Run the development server with:

```bash
yarn dev
```

Go to [`localhost:3000/api-doc`](localhost:3000/api-doc) to see the API interactive documentation.

## Test

There are no tests yet.

## Build

Build the project with:

```bash
yarn build
```

Run the built project with:

```bash
node dist/main.js
```
