FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

COPY .env ./

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start:prod"]
