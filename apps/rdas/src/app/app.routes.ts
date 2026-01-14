import { Routes } from '@angular/router';
import { environment } from '../environments/environment';

export const routes: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () => import('rdas-home').then((m) => m.RdasHomeComponent),
  },
  {
    path: 'diseases',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('rdas-browse').then((m) => m.RdasBrowseComponent),
  },
  {
    path: 'disease',
    pathMatch: 'full',
    runGuardsAndResolvers: 'pathParamsChange',
    loadComponent: () =>
      import('rdas-disease-page').then((m) => m.RdasDiseasePageComponent),
  },
  {
    path: 'about',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('rdas-about').then((m) => m.FeaturesRdasRdasAboutComponent),
  },
  {
    path: 'privacy',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    title: 'RDAS: Privacy Policy',
    loadComponent: () => import('rdas-privacy-page').then((m) => m.PrivacyPage),
    data: {
      appFullTitle: 'Rare Disease Alert System',
      appAcronym: 'RDAS',
      collectsPii: true,
      accountRegistration: true,
      contactEmail: 'ncatsrdas@mail.nih.gov',
    },
  },
  {
    path: 'article',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('rdas-article-page').then(
        (m) => m.FeaturesRdasRdasArticlePageComponent,
      ),
  },
  {
    path: 'grant',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('rdas-grant-page').then((m) => m.RdasGrantPageComponent),
  },
  {
    path: 'trial',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('rdas-trial-page').then((m) => m.RdasTrialPageComponent),
  },
  {
    path: 'subscriptions',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('rdas-subscriptions').then((m) => m.RdasSubscriptionsComponent),
  },
  {
    path: 'apis/diseases',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: {
      instance: `${environment.baseUrl}${
        environment.production ? '/' : ':7687/'
      }api/diseases`,
    },
    loadComponent: () =>
      import('graphql-sandbox').then((m) => m.GraphqlSandboxComponent),
  },
  {
    path: 'apis/publications',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: {
      instance: `${environment.baseUrl}${
        environment.production ? '/' : ':7690/'
      }api/articles`,
    },
    loadComponent: () =>
      import('graphql-sandbox').then((m) => m.GraphqlSandboxComponent),
  },
  {
    path: 'apis/projects',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: {
      instance: `${environment.baseUrl}${
        environment.production ? '/' : ':7689/'
      }api/projects`,
    },
    loadComponent: () =>
      import('graphql-sandbox').then((m) => m.GraphqlSandboxComponent),
  },
  {
    path: 'apis/trials',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: {
      instance: `${environment.baseUrl}${
        environment.production ? '/' : ':7688/'
      }api/trials`,
    },
    loadComponent: () =>
      import('graphql-sandbox').then((m) => m.GraphqlSandboxComponent),
  },
  {
    path: 'apis/epi',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () => import('epi-api').then((m) => m.EpiApiComponent),
  },
  {
    path: 'apis/history',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('history-api').then((m) => m.HistoryApiComponent),
  },
  { path: '**', redirectTo: '' },
];
