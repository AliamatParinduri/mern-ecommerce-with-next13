FROM node:lts-alpine3.17

WORKDIR /app/server

COPY package*.json .

RUN npm i

COPY . .

EXPOSE 5000

CMD [ "npm", "start" ]