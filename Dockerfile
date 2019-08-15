FROM node:8.16.0-stretch as BUILDER

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN npm run gen:schema && npm run build

FROM node:8.16.0-stretch-slim

WORKDIR /app

COPY --from=BUILDER /app ./

CMD ["node", "dist/src/index.js"]
