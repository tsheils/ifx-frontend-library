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
import { ArticleStore } from 'article-store';
import { ProjectStore } from 'project-store';
import { ClinicalTrialStore } from 'trial-store';
import { DiseaseStore } from 'disease-store';

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

export const articleResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot
) => {
  const articleStore = inject(ArticleStore);
  return articleStore.loadArticle(route.queryParams);
};

export const projectResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot
) => {
  const projectStore = inject(ProjectStore);
  return projectStore.loadProject(route.queryParams);
};

export const clinicalTrialResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot
) => {
  const clinicalTrialStore = inject(ClinicalTrialStore);
  return clinicalTrialStore.loadClinicalTrial(route.queryParams);
};

export const allStaticDiseaseFiltersResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot
) => {
  const allStaticDiseaseFiltersStore = inject(DiseaseStore);
  return allStaticDiseaseFiltersStore.loadAllDiseaseFilters({});
};

export const staticDiseaseFiltersResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot
) => {
  const staticDiseaseFiltersStore = inject(DiseaseStore);
  return staticDiseaseFiltersStore.loadStaticDiseaseFilters(route.queryParams);
};
export const diseaseResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot
) => {
  const diseaseStore = inject(DiseaseStore);
  return diseaseStore.loadDisease(route.queryParams);
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
    resolve: {
      allStaticFilters: allStaticDiseaseFiltersResolver,
      // //phenotypeFilters: phenotypeFilterResolver,
    },
    loadComponent: () =>
      import('rdas-browse').then((m) => m.RdasBrowseComponent),
  },
  {
    path: 'disease',
    pathMatch: 'full',
    runGuardsAndResolvers: 'pathParamsChange',
    resolve: {
      staticFilters: staticDiseaseFiltersResolver,
      disease: diseaseResolver
    },
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
    path: 'article',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: {
      article: articleResolver,
    },
    loadComponent: () =>
      import('article-page').then((m) => m.ArticlePageComponent),
  },
  {
    path: 'project',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: {
      project: projectResolver,
    },
    loadComponent: () =>
      import('project-page').then((m) => m.ProjectPageComponent),
  },
  {
    path: 'trial',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: {
      clinicalTrial: clinicalTrialResolver,
    },
    loadComponent: () =>
      import('rdas-trial-page').then((m) => m.RdasTrialPageComponent),
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
  { path: '**', redirectTo: '' },
];
