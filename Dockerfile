FROM node:12.18.2-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN apk add --no-cache --virtual .build-deps alpine-sdk python \
  && yarn install --frozen-lockfile

COPY . .

RUN yarn build \
  && apk del .build-deps

CMD [ "yarn",  "start" ]
