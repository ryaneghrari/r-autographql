const Config = require('../../config');
module.exports = `FROM node:11 as base

# Create app directory
WORKDIR /app

#Ensure both package.json and package-lock are copied
COPY package*.json ./

RUN npm set strict-ssl false

#Install app dependencies
RUN npm install

EXPOSE ${Config.port}
ENV NODE_TLS_REJECT_UNAUTHORIZED 0

FROM base as dev

RUN npm install -g nodemon

#Start server and watch files for changes
CMD ["nodemon","-e","js,json,txt","src"]

FROM base as prod

# Bundle app source
COPY . .

CMD ["node","src"]`