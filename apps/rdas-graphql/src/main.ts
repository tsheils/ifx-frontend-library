import { Neo4jGraphQL } from "@neo4j/graphql";
import { ApolloServer } from "apollo-server";
//import fs from "fs";
 import fs = require('fs');

import * as neo4j from "neo4j-driver";
import { environment } from "./environments/environment";

const instances =  environment.instances;

instances.forEach(instance => startInstance(instance))

function startInstance(instance) {
  console.log(instance.schema);
  fs.readFile(instance.schema, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    const typeDefs = data;
    const driver = neo4j.driver(instance.uri, neo4j.auth.basic(instance.neo4jUser, instance.neo4jPassword));
    const neoSchema = new Neo4jGraphQL({
      typeDefs,
      driver
    });
    startSchema(neoSchema, instance);
  })
}



function startSchema(neoSchema, instance){
  neoSchema.getSchema().then((schema) => {
    const server = new ApolloServer({
      schema,
      dataSources:() => ({

      })
    });

    server.listen({
      port:instance.port
    }).then(({url}) => {
      console.log(`🚀 Server ready at ${url}`);
    });
  })
}
