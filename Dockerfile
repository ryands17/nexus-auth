FROM node:12.18.4-alpine

WORKDIR /app

RUN apk add --no-cache --virtual .build-deps alpine-sdk python

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build \
  && apk del .build-deps

CMD [ "yarn",  "start" ]
