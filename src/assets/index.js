const Config = require('../../config');
module.exports = `
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const typeDefs  = require('./${Config.type_outfile}');
const resolvers = require('./${Config.resolver_outfile}');

const typeDef = gql\`
  type Query
\`;

const server = new ApolloServer({
  typeDefs: [typeDef, typeDefs],
  resolvers,
  playground: { version: '1.7.25' },
  uploads: false,
	context: ({ req }) => ({
	   headers: req.headers
	})
});

const app = express();

${
    Config.health_check.reduce((acc, route) => {
        return `${acc}app.get('${route}', function (req, res) {
  res.send("I'm healthy!")
})
`}, ``)
    }

server.applyMiddleware({ app });

app.listen({ port: ${Config.port} }, () =>
  console.log(\`🚀 Server ready at http://localhost:${Config.port}\${server.graphqlPath}\`)
);`