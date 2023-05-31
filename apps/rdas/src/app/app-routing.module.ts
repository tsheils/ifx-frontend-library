import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    //  redirectTo: 'diseases',
    // pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/rdas-home').then(
        (m) => m.RdasHomeComponent
      ),
  },
  {
    path: 'diseases',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/rdas-browse').then(
        (m) => m.RdasBrowseComponent
      ),
  },
  {
    path: 'disease',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/rdas-disease-page').then(
        (m) => m.RdasDiseasePageComponent
      ),
  },
  {
    path: 'subscriptions',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/rdas-subscriptions').then(
        (m) => m.RdasSubscriptionsComponent
      ),
  },
  /* {
    path: 'api',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      // eslint-disable-next-line @nx/enforce-module-boundaries
      import('@ncats-frontend-library/features/rdas/graphql-sandbox').then(
        (m) => m.GraphqlSandboxComponent
      ),
  }*/
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      //onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
