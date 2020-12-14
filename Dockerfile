FROM node:12-alpine

WORKDIR /app

RUN apk add --no-cache --virtual .build-deps alpine-sdk python

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build \
  && apk del .build-deps

EXPOSE 4002

CMD [ "yarn",  "start" ]
