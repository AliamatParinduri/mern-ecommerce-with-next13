FROM node:lts-alpine3.17

WORKDIR /app/admin-front

COPY package*.json .

RUN npm i

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]