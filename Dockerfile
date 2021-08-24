FROM node:alpine

WORKDIR /app

COPY src/package*.json ./

RUN npm install

RUN npm install -g sequelize-cli

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]