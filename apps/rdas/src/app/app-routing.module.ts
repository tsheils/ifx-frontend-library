import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'diseases',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
    /* pathMatch: 'full',
     runGuardsAndResolvers: 'paramsOrQueryParamsChange',
     loadChildren: () =>
       import('@ncats-frontend-library/features/rdas/rdas-home').then(
         (m) => m.FeaturesRdasRdasHomeModule
       ),*/
  },{
    path: 'diseases',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadChildren: () =>
      import('@ncats-frontend-library/features/rdas/rdas-browse').then(
        (m) => m.FeaturesRdasRdasBrowseModule
      ),
  },{
    path: 'disease',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadChildren: () =>
      import('@ncats-frontend-library/features/rdas/rdas-disease-page').then(
        (m) => m.FeaturesRdasRdasDiseasePageModule
      ),
  },
  {
    path: 'subscriptions',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadChildren: () =>
      // eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
      import('@ncats-frontend-library/features/rdas/rdas-subscriptions').then(
        (m) => m.FeaturesRdasRdasSubscriptionsModule
      ),
  },
  {
    path: 'api',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadChildren: () =>
      // eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
      import('@ncats-frontend-library/features/rdas/graphql-sandbox').then(
        (m) => m.FeaturesRdasGraphqlSandboxModule
      ),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
