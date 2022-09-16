const fs = require('fs');
const { Neo4jGraphQL } = require("@neo4j/graphql");
const { ApolloServer, gql } = require("apollo-server");
const neo4j = require("neo4j-driver");
const WebSockets = require('ws');

"use strict";

import {environment} from "./environments/environment.prod";



const neo4jUser= "";
const neo4jPassword = "";
const uri = '' //environment.neo4jUrl;

const driver = neo4j.driver(uri, neo4j.auth.basic(neo4jUser, neo4jPassword), {connectionPoolSize: 50});

const instances = environment.instances

//function startInstances() {
instances.forEach(instance => startInstance(instance))
//}


function startInstance(instance) {
  console.log(instance);
  fs.readFile(instance.schema, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    const typeDefs = data;
    const driver = neo4j.driver(instance.uri, neo4j.auth.basic(instance.neo4jUser, instance.neo4jPassword));
    const neoSchema = new Neo4jGraphQL({
      typeDefs,
      driver,
      csrfPrevention: true
    });
    startSchema(neoSchema, instance);
  })
}



function startSchema(neoSchema, instance){
  neoSchema.getSchema().then((schema) => {
    const server = new ApolloServer({
      schema,
    });

    server.listen({
      port:instance.port
    }).then(({url}) => {
      console.log(`🚀 Server ready at ${url}`);
    });
  })
}

process.title = 'gard-alert-rdip2';

/**
 *  Port where we'll run the websocket server
 */
const wss = new WebSockets.Server({ port: 1338 });

wss.on('connection', ws => {
  ws.on('message', message => {
    console.log(message);
    const session = driver.rxSession();
    const mes = JSON.parse(message);
    if (mes.txcType) {
      switch (mes.txcType) {
        case 'write': {
          session.writeTransaction(txc => txc.run(mes.call, mes.params).records()).subscribe(res=> {
            ws.send(JSON.stringify({origin: mes.origin, data: res.toObject(), params: mes.params}));
          });
          break;
        }
        case 'read':
        default: {
          session.readTransaction(txc => txc.run(mes.call, mes.params).records()).subscribe(res=> {
            ws.send(JSON.stringify({origin: mes.origin, data: res.toObject(), params: mes.params}));
          });
          break;
        }
      }
    }
  });
  ws.on('error', error => {
    console.log(error);
  });
  ws.on('close', ws=> {
    console.log((new Date()) + " Peer "
      + ws.remoteAddress + " disconnected.");  })
});

