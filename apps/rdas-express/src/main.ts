

import { ApolloServer } from "@apollo/server";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault
} from "@apollo/server/plugin/landingPage/default";
import { expressMiddleware } from "@apollo/server/express4";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Neo4jGraphQL } from "@neo4j/graphql";
import { json } from "express";
import * as express from "express";
import * as cors from 'cors';
import * as path from 'path';
import * as neo4j from "neo4j-driver";
import fs = require('fs');
import { environment } from "./environments/environment";

const instances =  environment.instances;
//const driver = neo4j.driver(environment.url, neo4j.auth.basic(environment.neo4jUser, environment.neo4jPassword));

instances.forEach(instance => startInstance(instance))

function startInstance(instance) {
  console.log(instances)
  console.log(instance)
  const driver = neo4j.driver(instance.uri, neo4j.auth.basic(instance.neo4jUser, instance.neo4jPassword));
  fs.readFile(instance.schema, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    const typeDefs = data;
   /* const neoSchema: Neo4jGraphQL = new Neo4jGraphQL({
      typeDefs,
      driver,
      config: {
        driverConfig: {
          database: instance.source
        },
      },
    });*/
     const neoSchema: Neo4jGraphQL = new Neo4jGraphQL({ typeDefs, driver });
    startSchema(neoSchema, instance);
  })
}

function startSchema(neoSchema, instance){
  const app = express();
  neoSchema.getSchema().then((schema) => {
    const apolloServer = new ApolloServer({
      schema,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault()
    /*    ApolloServerPluginLandingPageProductionDefault(
          {footer: false}
        )*/
      ],
    });

    apolloServer.start().then((data) => {
      app.use(
        '/',
        cors<cors.CorsRequest>({ origin: ['http://localhost:4200', 'https://studio.apollographql.com'] }),
        json(),
        expressMiddleware(apolloServer),
      );
    })
  })

  const port = instance.port;
  const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
  server.on('error', console.error);

}

//app.use('/assets', express.static(path.join(__dirname, 'assets')));

/*app.get('/', (req, res) => {
  res.send({ message: 'Welcome to rdas-express!' });
});*/


