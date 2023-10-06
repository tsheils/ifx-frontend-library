import { importProvidersFrom } from "@angular/core";
import { Routes } from '@angular/router';
import { ArticlesEffects, articlesReducer } from "@ncats-frontend-library/stores/article-store";
import { GrantsEffects, grantsReducer } from "@ncats-frontend-library/stores/grant-store";
import { TrialsEffects, trialsReducer } from "@ncats-frontend-library/stores/trial-store";
import { UsersFacade } from "@ncats-frontend-library/stores/user-store";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { environment } from "../environments/environment";


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
    path: 'article',
    pathMatch: 'full',
    providers: [
      importProvidersFrom(
        // register feature reducer
        StoreModule.forFeature('articleStore', articlesReducer),
        // run feature effects
        EffectsModule.forFeature([ArticlesEffects])
      )    ],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/rdas-article-page').then(
        (m) => m.FeaturesRdasRdasArticlePageComponent
      ),
  },
  {
    path: 'grant',
    pathMatch: 'full',
    providers: [
      importProvidersFrom(
        // register feature reducer
        StoreModule.forFeature('grants', grantsReducer),
        // run feature effects
        EffectsModule.forFeature([GrantsEffects])
      )    ],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/rdas-grant-page').then(
        (m) => m.RdasGrantPageComponent
      ),
  },
  {
    path: 'trial',
    pathMatch: 'full',
    providers: [
      importProvidersFrom(
        // register feature reducer
        StoreModule.forFeature('trials', trialsReducer),
        // run feature effects
        EffectsModule.forFeature([TrialsEffects])
      )    ],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/rdas-trial-page').then(
        (m) => m.RdasTrialPageComponent
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
   {
    path: 'apis/diseases',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
     data: {
       instance: `${environment.baseUrl}api/diseases`
     },
    loadComponent: () =>
      // eslint-disable-next-line @nx/enforce-module-boundaries
      import('@ncats-frontend-library/features/rdas/graphql-sandbox').then(
        (m) => m.GraphqlSandboxComponent
      ),
  },
  {
    path: 'apis/publications',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
     data: {
       instance: `${environment.baseUrl}api/publications`
     },
    loadComponent: () =>
      // eslint-disable-next-line @nx/enforce-module-boundaries
      import('@ncats-frontend-library/features/rdas/graphql-sandbox').then(
        (m) => m.GraphqlSandboxComponent
      ),
  },
  {
    path: 'apis/projects',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: {
      instance: `${environment.baseUrl}api/projects`
    },
    loadComponent: () =>
      // eslint-disable-next-line @nx/enforce-module-boundaries
      import('@ncats-frontend-library/features/rdas/graphql-sandbox').then(
        (m) => m.GraphqlSandboxComponent
      ),
  },{
    path: 'apis/trials',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: {
      instance: `${environment.baseUrl}api/trials`
    },
    loadComponent: () =>
      // eslint-disable-next-line @nx/enforce-module-boundaries
      import('@ncats-frontend-library/features/rdas/graphql-sandbox').then(
        (m) => m.GraphqlSandboxComponent
      ),
  },{
    path: 'apis/epi',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      // eslint-disable-next-line @nx/enforce-module-boundaries
      import('@ncats-frontend-library/features/rdas/epi-api').then(
        (m) => m.EpiApiComponent
      ),
  },
  { path: '**', redirectTo: '' },
];



/* RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      //onSameUrlNavigation: 'reload',
    })
    */
