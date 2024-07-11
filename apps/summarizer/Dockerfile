FROM node:18-slim

WORKDIR /app

COPY .npmrc apps/summarizer ./

RUN corepack enable

RUN pnpm i

RUN pnpm build

CMD ["pnpm", "start"]