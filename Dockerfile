FROM node:12.16.3-stretch as BUILDER

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile && yarn build

FROM node:12.16.3-stretch-slim

WORKDIR /app

COPY --from=BUILDER /app ./

EXPOSE 4002

CMD ["node", "dist/src/index.js"]
