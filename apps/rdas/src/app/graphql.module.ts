import {NgModule} from '@angular/core';
import { ApolloModule, APOLLO_NAMED_OPTIONS, APOLLO_OPTIONS, NamedOptions } from "apollo-angular";
import {ApolloClientOptions, InMemoryCache} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';

const uri = ''; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: httpLink.create({uri}),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    /*{
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },*/
    {
      provide: APOLLO_NAMED_OPTIONS, // <-- Different from standard initialization
      useFactory(httpLink: HttpLink): NamedOptions {
        return {
          articles: /* <-- this settings will be saved as default client */ {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: 'http://localhost:4000',
            }),
          },
          trials: /* <-- these settings will be saved by name: newClientName */ {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: 'http://localhost:4001',
            }),
          },
          projects: {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: 'http://localhost:4002',
            }),
          },
        };
      },
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
