import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { Neo4jGraphQL } from '@neo4j/graphql';
import express, { Express, json } from 'express';
import * as neo4j from 'neo4j-driver';
import cors from 'cors';
import http from 'http';
import * as winston from 'winston';
import fs from 'fs';
import { environment } from './environments/environment';

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

const app: Express = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

const instances = environment.instances;

instances.forEach((instance) => startSchema(instance));

function startSchema(instance) {
  const driver = neo4j.driver(
    environment.memgraphUrl + ':' + instance.port,
    neo4j.auth.basic(environment.memgraphUser, environment.memgraphKey)
  );

  fs.readFile(instance.schema, 'utf8', async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const typeDefs = data;
    const neoSchema: Neo4jGraphQL = new Neo4jGraphQL({
      typeDefs,
      driver,
      //debug: true,
    });

    try {
      const apolloServer: ApolloServer = new ApolloServer({
        schema: await neoSchema.getSchema(),
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
      });
      await apolloServer.start();

      app.use(
        `/api/${instance.name}`,
        cors<cors.CorsRequest>(),
        json(),
        expressMiddleware(apolloServer, {
          context: async ({ req }) => ({
            req,
            sessionConfig: { database: instance.source, port: instance.port },
          }),
        }),
        (req, res, next) => {
          // apolloServer.logger.info(req)
          //   console.log(req);
          logger.info(`Received a ${req.method} request for ${req.url}`);
          next();
        }
      );
    } catch (e) {
      console.log(e);
      logger.error(e);
    }

    try {
      const port = instance.port;
      const server = app.listen(port, () => {
        logger.info(
          `${instance.name} API listening to port ${port} at ${environment.memgraphUrl}`
        );
      });
    } catch (e) {
      console.log(e);
      logger.error(e);
    }
  });
}
