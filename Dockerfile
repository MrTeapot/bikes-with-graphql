FROM node:16-alpine3.11 AS dev
WORKDIR /usr/src/app
RUN npm install nodemon -g
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
CMD ["npm", "run", "start-dev"]

FROM dev as test
CMD ["npm", "run", "test"]

FROM dev AS prod
CMD ["npm", "run", "start"]