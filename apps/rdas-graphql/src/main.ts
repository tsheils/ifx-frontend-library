import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Neo4jGraphQL } from "@neo4j/graphql";
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';
import { GraphQLSchema } from "graphql";
import express, { json } from "express";
import cors from 'cors';

//import fs from "fs";
 import fs = require('fs');

import * as neo4j from "neo4j-driver";
import { environment } from "./environments/environment.prod";
const app = express();

const instances =  environment.instances;
 const driver = neo4j.driver('xxx', neo4j.auth.basic('xxx', 'xxx'));

instances.forEach(instance => startInstance(instance))

function startInstance(instance) {
  //const driver = neo4j.driver(instance.uri, neo4j.auth.basic(instance.neo4jUser, instance.neo4jPassword));
  fs.readFile(instance.schema, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    const typeDefs = data;
    const neoSchema: Neo4jGraphQL = new Neo4jGraphQL({
      typeDefs,
      driver,
      config: {
        driverConfig: {
          database: instance.source
        },
      },
    });
   // const neoSchema: Neo4jGraphQL = new Neo4jGraphQL({ typeDefs, driver });
    startSchema(neoSchema, instance);
  })
}



function startSchema(neoSchema, instance){
  neoSchema.getSchema().then((schema) => {
    const server = new ApolloServer({
      schema,
    });

    server.start().then((data) => {
      console.log(data);
      app.use(
        '/graphql',
        cors<cors.CorsRequest>({ origin: ['http://localhost:4200', 'https://studio.apollographql.com'] }),
        json(),
        expressMiddleware(server),
      );
      console.log(`🚀 Server ready at ${data}`);
    })

    // Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
    startStandaloneServer(server, {
      listen: { port: instance.port },
    }).then(({url}) => {
      console.log(`🚀 Server ready at ${url}`);
    });
  })
}
