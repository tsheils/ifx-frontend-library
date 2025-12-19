import { Routes } from '@angular/router';
import { RampHomeComponent } from 'ramp-home';

import {
  STRUCTURE_VIEWER_COMPONENT,
  StructureViewerComponent,
} from 'structure-viewer';

export const routes: Routes = [
  {
    path: '',
    title: 'RaMP: Home',
    component: RampHomeComponent,
  },
  {
    path: 'analyze',
    title: 'RaMP: Biochemical Pathways',
    loadComponent: () => import('ramp-main').then((m) => m.RampMainComponent),
  },
  {
    path: 'biochemical-pathways',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    title: 'RaMP: Biochemical Pathways',
    loadComponent: () => import('ramp-main').then((m) => m.RampMainComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('biochemical-pathways-page').then(
            (m) => m.BiochemicalPathwaysPageComponent,
          ),
      },
    ],
  },
  {
    path: 'ontologies',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    title: 'RaMP: Ontologies',
    loadComponent: () => import('ramp-main').then((m) => m.RampMainComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('ontologies-page').then((m) => m.OntologiesPageComponent),
      },
    ],
  },
  {
    path: 'reactions',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    title: 'RaMP: Chemical Reactions',
    loadComponent: () => import('ramp-main').then((m) => m.RampMainComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('reactions-page').then((m) => m.ReactionsPageComponent),
      },
    ],
  },
  {
    path: 'chemical-descriptors',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    title: 'RaMP: Chemical Descriptors',
    loadComponent: () => import('ramp-main').then((m) => m.RampMainComponent),
    children: [
      {
        providers: [
          {
            provide: STRUCTURE_VIEWER_COMPONENT,
            useValue: StructureViewerComponent,
          },
        ],
        path: '',
        loadComponent: () =>
          import('chemical-descriptors-page').then(
            (m) => m.ChemicalDescriptorsPageComponent,
          ),
      },
    ],
  },
  {
    path: 'identifier-harmonization',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    title: 'RaMP: Identifier Harmonization',
    loadComponent: () => import('ramp-main').then((m) => m.RampMainComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('metlinkr-page').then((m) => m.MetlinkrPageComponent),
      },
    ],
  },
  {
    path: 'about',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    title: 'RaMP: About',
    loadComponent: () => import('ramp-about').then((m) => m.AboutComponent),
  },
  {
    path: 'api',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    title: 'RaMP: API',
    loadComponent: () => import('ramp-api').then((m) => m.RampApiComponent),
  },
  {
    path: 'privacy',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    title: 'RaMP: Privacy Policy',
    loadComponent: () => import('privacy-page').then((m) => m.PrivacyPage),
    data: {
      appFullTitle: 'Relational Database of Metabolomics Pathways',
      appAcronym: 'RaMP-DB',
      collectsPii: false,
      accountRegistration: false,
      contactEmail: 'NCATSRaMP@nih.gov',
    },
  },
];
