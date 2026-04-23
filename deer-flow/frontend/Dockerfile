FROM node:22-alpine AS base
# Enable corepack for pnpm
RUN corepack enable

FROM base AS builder
WORKDIR /app
# We are copying from the root context (deer-flow/)
COPY frontend/package.json frontend/pnpm-lock.yaml ./frontend/
WORKDIR /app/frontend
RUN pnpm install --frozen-lockfile

# Copy the rest of the frontend code
COPY frontend/ ./
RUN pnpm run build

FROM base AS prod
WORKDIR /app
COPY --from=builder /app/frontend/package.json /app/frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# The build output is usually in 'dist'
COPY --from=builder /app/frontend/dist ./dist

RUN pnpm add -g serve

EXPOSE 3000
ENV PORT=3000
CMD ["serve", "-s", "dist", "-l", "3000"]
