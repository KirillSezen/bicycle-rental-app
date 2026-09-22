FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

ENV NODE_ENV=production

RUN npm ci --omit=dev --ignore-scripts

EXPOSE 3000

CMD ["node", "dist/main.js"]