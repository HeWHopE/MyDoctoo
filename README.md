# doctoo

WIP.

## Installation

1. Install [nvm](https://github.com/nvm-sh/nvm) or [LTS Node.js](https://nodejs.org) directly from official website.
2. Install [Docker](https://www.docker.com) to run project in containers for dev and prod environment.
3. Activate corepack (`corepack enable`) to enable pnpm or install it manually: `npm i pnpm@latest -g`.
4. Clone this repository - `git clone https://github.com/Radency/internship-2024-doctoo`.
5. Install all project dependencies - `pnpm i -r`.
6. Install `Prisma` extension, extension id in extensions store: `Prisma.prisma`.
7. Install `ESLint` extension, extension id in extensions store: `dbaeumer.vscode-eslint` &
   `rvest.vs-code-prettier-eslint`.
8. Install `Prettier` extension, extension id in extensions store: `esbenp.prettier-vscode`.

## Development

1. Make sure you are in the `development` branch.
2. Create a new branch from the `development` branch with the name of what you are going to do.
3. Make the necessary changes and create a PR that will be directed to the `development` branch.

### Backend

1. First of all, you need to generate types for Prisma.
2. Move to `apps/backend` folder and run this commands:

- `pnpm prisma format` - Format prisma schema if models updated.
- `pnpm prisma migrate dev` - Generate new migration for new changes.
- `pnpm prisma generate` - Generate types for Prisma.

## Docker

### Development Mode

1. Create a new file `.env.dev` and paste the contents from the `.env.dev.example` file into it.
2. In `apps/backend` folder create a new file `.env` and paste the contents from the `.env.example` file.
3. Run `docker compose -f docker-compose.dev.yaml --env-file=.env.dev up -d`.
4. Done. When running locally, the backend should have a connection to the database.

### Production Mode

1. Create a new file `.env.prod` and paste the contents from the `.env.prod.example` file into it. Fill in all required
   variables.
2. Run `docker compose -f docker-compose.prod.yaml --env-file=.env.prod up --build -d --remove-orphans`.
3. Done. With the `docker ps` command you should see the database, backend, frontend and some additional services.

> To stop **prod** or **dev** containers, you need run `docker compose -f docker-compose.[dev|prod].yaml down`.

## Conventional Commits

Commits, PR names, and anything else related to Git management must be named according to the
[CC standart](https://www.conventionalcommits.org/en/v1.0.0/).
