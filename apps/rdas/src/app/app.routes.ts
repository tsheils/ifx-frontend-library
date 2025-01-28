import { Routes } from '@angular/router';
import { environment } from '../environments/environment';

export const routes: Routes = [
  {
    path: '',
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
    runGuardsAndResolvers: 'pathParamsChange',
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/rdas-disease-page').then(
        (m) => m.RdasDiseasePageComponent
      ),
  },
  {
    path: 'about',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/rdas-about').then(
        (m) => m.FeaturesRdasRdasAboutComponent
      ),
  },
  {
    path: 'privacy',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/privacy-page').then(
        (m) => m.RdasPrivacyPageComponent
      ),
  },
  {
    path: 'article',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/rdas-article-page').then(
        (m) => m.FeaturesRdasRdasArticlePageComponent
      ),
  },
  {
    path: 'grant',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/rdas-grant-page').then(
        (m) => m.RdasGrantPageComponent
      ),
  },
  {
    path: 'trial',
    pathMatch: 'full',
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
      instance: `${environment.baseUrl}${
        environment.production ? '/' : ':4000/'
      }api/diseases`,
    },
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/graphql-sandbox').then(
        (m) => m.GraphqlSandboxComponent
      ),
  },
  {
    path: 'apis/publications',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: {
      instance: `${environment.baseUrl}${
        environment.production ? '/' : ':4001/'
      }api/articles`,
    },
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/graphql-sandbox').then(
        (m) => m.GraphqlSandboxComponent
      ),
  },
  {
    path: 'apis/projects',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: {
      instance: `${environment.baseUrl}${
        environment.production ? '/' : ':4002/'
      }api/grants`,
    },
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/graphql-sandbox').then(
        (m) => m.GraphqlSandboxComponent
      ),
  },
  {
    path: 'apis/trials',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: {
      instance: `${environment.baseUrl}${
        environment.production ? '/' : ':4003/'
      }api/trials`,
    },
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/graphql-sandbox').then(
        (m) => m.GraphqlSandboxComponent
      ),
  },
  {
    path: 'apis/epi',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/epi-api').then(
        (m) => m.EpiApiComponent
      ),
  },
  {
    path: 'apis/history',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/history-api').then(
        (m) => m.HistoryApiComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
