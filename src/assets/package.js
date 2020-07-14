const Config = require('../../config');

module.exports = {
    "name": Config.project_name || "GraphqlServer",
    "version": "1.0.0",
    "description": Config.project_desc || "Graphql for server",
    "main": "index.js",
    "scripts": {
        "start": "npm run build-dev && npm run start-dev",
        "build-prod": "docker build --target prod -t ou-graphql:prod .",
        "build-dev": "docker build --target dev -t  ou-graphql:dev .",
        "start-dev": `docker container run --rm -p ${Config.port}:${Config.port} -v $(pwd):/app -v /app/node_modules ou-graphql:dev`
    },
    "author": "",
    "license": "ISC",
    "dependencies": {
        "apollo-server-express": "^2.0.0",
        "body-parser": "^1.19.0",
        "express": "^4.17.1",
        "graphql": "^14.4.2",
    }
}