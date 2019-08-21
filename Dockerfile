FROM node:8.16.0-stretch as BUILDER

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

ENV POSTGRESQL_URL=$POSTGRESQL_URL

RUN npm run gen:schema && npm run build

FROM node:8.16.0-stretch-slim

WORKDIR /app

COPY --from=BUILDER /app ./

EXPOSE 4002

CMD ["node", "dist/src/index.js"]
