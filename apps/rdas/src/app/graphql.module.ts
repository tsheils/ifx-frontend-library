import { NgModule } from '@angular/core';
import {
  ApolloModule,
  APOLLO_NAMED_OPTIONS,
  NamedOptions,
} from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { environment } from '../environments/environment';

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_NAMED_OPTIONS,
      useFactory(httpLink: HttpLink): NamedOptions {
        return {
          diseases: {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: `${environment.baseUrl}${
                environment.production ? '/' : ':4000/'
              }api/diseases`,
            }),
          },
          articles: {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: `${environment.baseUrl}${
                environment.production ? '/' : ':4001/'
              }api/articles`,
            }),
          },
          projects: {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: `${environment.baseUrl}${
                environment.production ? '/' : ':4002/'
              }api/grants`,
            }),
          },
          trials: {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: `${environment.baseUrl}${
                environment.production ? '/' : ':4003/'
              }api/trials`,
            }),
          },
        };
      },
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
