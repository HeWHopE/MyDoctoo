FROM node:18-slim AS angular-build

WORKDIR /app

COPY .npmrc ./apps/angular ./

RUN corepack enable

RUN pnpm i

RUN pnpm build

FROM node:18-slim AS frontend-build

WORKDIR /app

COPY .npmrc ./apps/frontend ./

RUN corepack enable

RUN pnpm i

ARG VITE_BACKEND_API_URL
ARG VITE_STRIPE_API_KEY
ARG VITE_S3_BASE_URL
ARG VITE_FHIR_ISS_URL
ARG VITE_FHIR_CLIENT_ID

COPY --from=angular-build /frontend/angular /app/angular

RUN VITE_FHIR_ISS_URL=${VITE_FHIR_ISS_URL} VITE_FHIR_CLIENT_ID=${VITE_FHIR_CLIENT_ID} VITE_S3_BASE_URL=${VITE_S3_BASE_URL} VITE_STRIPE_API_KEY=${VITE_STRIPE_API_KEY} VITE_BACKEND_API_URL=${VITE_BACKEND_API_URL} pnpm build

FROM devforth/spa-to-http:latest

COPY --from=frontend-build /app/dist .