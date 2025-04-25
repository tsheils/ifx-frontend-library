/*
import { inject, NgModule } from '@angular/core';
import {
  APOLLO_NAMED_OPTIONS,
  NamedOptions, provideApollo
} from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { environment } from '../environments/environment';

export const apolloConfig = {
  providers: [
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      return {
        link: httpLink.create({ uri: '/graphql' }),
        cache: new InMemoryCache(),
        // other options...
      };
    }),
  ],
};





@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_NAMED_OPTIONS,
      useFactory(httpLink: HttpLink): NamedOptions {
        return {
          /!*diseases: {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: `${environment.baseUrl}${
                environment.production ? '/' : ':7687/'
              }api/diseases`,
            }),
          },*!/
          articles: {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: `${environment.baseUrl}${
                environment.production ? '/' : ':7690/'
              }api/articles`,
            }),
          },
         /!* projects: {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: `${environment.baseUrl}${
                environment.production ? '/' : ':7689/'
              }api/grants`,
            }),
          },
          trials: {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: `${environment.baseUrl}${
                environment.production ? '/' : ':7688/'
              }api/trials`,
            }),
          },*!/
        };
      },
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
*/
