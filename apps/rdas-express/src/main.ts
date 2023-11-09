import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { expressMiddleware } from '@apollo/server/express4';
import { Neo4jGraphQL } from '@neo4j/graphql';
import { json } from 'express';
import * as express from 'express';
import * as neo4j from 'neo4j-driver';
import * as cors from 'cors';
import * as winston from 'winston';
import fs = require('fs');
import { environment } from './environments/environment';

const instances = environment.instances;
const driver = neo4j.driver(
  environment.url,
  neo4j.auth.basic(environment.neo4jUser, environment.neo4jPassword)
);

const logger = winston.createLogger({
  level: 'info',
  // Use timestamp and printf to create a standard log format
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' }),
  ],
});

instances.forEach((instance) => startInstance(instance));

function startInstance(instance) {
  //  const driver = neo4j.driver(instance.uri, neo4j.auth.basic(instance.neo4jUser, instance.neo4jPassword));
  fs.readFile(instance.schema, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const typeDefs = data;
    const neoSchema: Neo4jGraphQL = new Neo4jGraphQL({
      typeDefs,
      driver,
      config: {
        driverConfig: {
          database: instance.source,
        },
      },
    });
    //  const neoSchema: Neo4jGraphQL = new Neo4jGraphQL({ typeDefs, driver });
    startSchema(neoSchema, instance);
  });
}

function startSchema(neoSchema, instance) {
  const app = express();
  neoSchema.getSchema().then(async (schema) => {
    const apolloServer: ApolloServer = new ApolloServer({
      schema,
      introspection: true,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault({
          embed: {
            runTelemetry: false,
          },
        }),
        /*    ApolloServerPluginLandingPageProductionDefault(
              {footer: false}
            )*/
      ],
    });

    // Note you must call `start()` on the `ApolloServer`
    // instance before passing the instance to `expressMiddleware`
    await apolloServer.start();
    //  apolloServer.start().then((data) => {

    app.use(
      `/`,
      cors<cors.CorsRequest>(),
      json(),
      expressMiddleware(apolloServer),
      (req, res, next) => {
        logger.info(`Received a ${req.method} request for ${req.url}`);
        next();
      }
    );
  });
  //  })

  const port = instance.port;
  const server = app.listen(port, () => {
  });
  console.log(server.address());
  server.on('error', console.error);
}

/*        cors({ origin: ['http://localhost', 'http://localhost:4200',
    'https://studio.apollographql.com',
    'http://rdas-dev.ncats.nih.gov',
    'https://rdas-dev.ncats.nih.gov',
    'http://rdas-test.ncats.nih.gov',
    'https://rdas-test.ncats.nih.gov',
    'http://rdas.ncats.nih.gov',
    'https://rdas.ncats.nih.gov'
  ] }),*/
