FROM node:10.18.0-stretch as BUILDER

WORKDIR /app

COPY . .

RUN yarn && yarn build

FROM node:10.18.0-stretch-slim

WORKDIR /app

COPY --from=BUILDER /app ./

EXPOSE 4002

CMD ["node", "dist/src/index.js"]
