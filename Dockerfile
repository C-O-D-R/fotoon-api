FROM node:16
WORKDIR /usr/src/fotoon-api
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "node", "server.js" ]