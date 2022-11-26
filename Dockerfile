#https://medium.com/@alpercitak/dockerize-next-js-with-prisma-19b7b9d82134
FROM node:16.13.0-slim AS dependencies

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn

FROM node:16.13.0-slim AS build

WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN apt-get update && apt-get install -y openssl libssl-dev
RUN npx prisma generate
RUN yarn build

FROM node:16.13.0-slim AS deploy 

WORKDIR /app

ENV NODE_ENV production

COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]