import {
  ActivatedRouteSnapshot,
  ResolveFn,
  Route,
  RouterStateSnapshot,
} from '@angular/router';
import { Gene } from 'rdas-models';
import { inject } from '@angular/core';
import { GeneStore } from 'gene-store';
import { PhenotypeStore } from 'phenotype-store';
import { FilterCategory } from 'utils-models';

export const geneFilterResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  router: RouterStateSnapshot,
) => {
  const geneStore = inject(GeneStore);
  const params = route.queryParams;
  return geneStore.loadGeneFilters(params);
};
export const phenotypeFilterResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  router: RouterStateSnapshot,
) => {
  const phenotypeStore = inject(PhenotypeStore);
  const params = route.queryParams;
  return phenotypeStore.loadPhenotypeFilters(params);
};

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
    /*   resolve: {
     // geneFilters: geneFilterResolver,
     // //phenotypeFilters: phenotypeFilterResolver,
    },*/
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
/*  {
    path: 'apis/abstract-abstraction',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('abstract-extraction-api').then((m) => m.AbstractExtractionApi),
  },*/
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
