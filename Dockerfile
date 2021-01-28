#---Build stage starting---
FROM node:12.16.1-alpine

ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /home/node/app
RUN chown -R node:node /home/node/app

RUN echo "====== copy files ======"

COPY ./src  ./src
COPY ./app.js ./
COPY ./web.config ./
COPY ./tsconfig.json ./
COPY ./tslint.json ./
COPY ./webpack.common.js ./
COPY ./webpack.prod.js ./
COPY ./package*.json ./

RUN chown -R node:node .
USER node

RUN echo "====== install dependencies ======"
RUN npm install

RUN echo "====== build app ======"
RUN npm run build

EXPOSE 8000 8001
CMD [ "npm", "start" ]
