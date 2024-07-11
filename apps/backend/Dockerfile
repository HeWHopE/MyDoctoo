FROM node:18-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY .npmrc apps/backend ./

RUN corepack enable

RUN pnpm i

RUN pnpm build

CMD ["pnpm", "start"]