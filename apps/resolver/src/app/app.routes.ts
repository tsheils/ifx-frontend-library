import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('resolver-main').then((m) => m.ResolverMainComponent),
  },
];
