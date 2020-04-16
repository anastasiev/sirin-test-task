FROM node:12

WORKDIR .

COPY . .

RUN npm install

RUN npm run build

COPY ./src/db/migrations ./build/db/migrations

EXPOSE 3004

CMD [ "npm", "start" ]