# Autogql

Generate GraphQL server based on given resources

Do you have REST endpoints you want converted to a GraphQL Server?

This is for you.

## Quick Start
Clone project

Navigate to `./resources.js` and update your resources:

```
module.exports = [
  {
    url: 'https://jsonplaceholder.typicode.com/posts',
    name: "post",
    type: "rest"
  },
  {
    url: 'https://jsonplaceholder.typicode.com/comments',
    name: "comment",
    type: "rest"
  }
];
```
Next `npm run start` to build a Graphql server which serves the listed resources.
Finally `npm run test` will start the development graphql server. 

### Config

Editable configuration values: 
```
    project_name: "Example",                  //Name of npm package
    project_desc: "Example Description",      //Description of npm package
    health_check: ["/health", "/api/health"], //Static healthcheck routes 
    port: 3000,                               //Port generated server will listen to 
    type_outfile: "typeDefs.js",              //Name of file containing type definitions
    resolver_outfile: "resolvers.js"          //Name of file containing resolvers
```