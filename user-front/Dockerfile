FROM node:lts-alpine3.17

WORKDIR /app/user-front

COPY package*.json .

RUN npm i

COPY . .

EXPOSE 5173

CMD [ "npm", "start" ]