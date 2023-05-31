import { importProvidersFrom } from "@angular/core";
import { Routes } from '@angular/router';
import { StoresDiseaseStoreModule } from "@ncats-frontend-library/stores/disease-store";
import { StoresUserStoreModule, UsersEffects, UsersFacade } from "@ncats-frontend-library/stores/user-store";
import { provideEffects } from "@ngrx/effects";
import { provideState } from "@ngrx/store";
import * as fromUsers from '@ncats-frontend-library/stores/user-store';
export const routes: Routes = [
  {
    path: '',
    //  redirectTo: 'diseases',
    // pathMatch: 'full',
    providers: [
      UsersFacade
    ],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadChildren: () =>
      import('@ncats-frontend-library/features/rdas/rdas-home').then(
        (m) => m.rdasHomeRoutes),
  },
  {
    path: 'diseases',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadChildren: () =>
      import('@ncats-frontend-library/features/rdas/rdas-browse').then(
        (m) => m.rdasBrowseRoutes
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



/* RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      //onSameUrlNavigation: 'reload',
    })
    */
