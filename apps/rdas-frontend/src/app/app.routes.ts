import { Route } from '@angular/router';

export const appRoutes: Route[] = [
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
    loadComponent: () => import('ifx-privacy-page').then((m) => m.PrivacyPage),
    data: {
      appFullTitle: 'Rare Disease Alert System',
      appAcronym: 'RDAS',
      collectsPii: true,
      accountRegistration: true,
      contactEmail: 'ncatsrdas@mail.nih.gov',
    },
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
    path: 'project',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('rdas-project-page').then((m) => m.RdasProjectPageComponent),
  },
  {
    path: 'trial',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('rdas-trial-page').then((m) => m.RdasTrialPageComponent),
  },
  { path: '**', redirectTo: '' },
];
