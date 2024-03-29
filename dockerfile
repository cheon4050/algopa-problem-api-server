FROM node:14.17.3-alpine

RUN mkdir -p /app
WORKDIR /app

EXPOSE 5001

RUN npm install -g pm2
RUN apk --no-cache add curl

ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json
RUN npm ci

ADD problems /app/problems
ADD ecosystem.config.js /app/ecosystem.config.js
ADD tsconfig.json /app/tsconfig.json
ADD tsconfig.build.json /app/tsconfig.build.json

ADD src /app/src
RUN npm run build

CMD [ "npm", "run", "start:prod"]