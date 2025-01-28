import { Routes } from '@angular/router'
import {
  STRUCTURE_VIEWER_COMPONENT,
  StructureViewerComponent,
} from 'structure-viewer'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    title: 'RaMP: Home',
    loadComponent: () =>
      import('@ramp/features/ramp/ramp-home').then((m) => m.RampHomeComponent),
  },
  {
    path: 'analyze',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
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
            (m) => m.BiochemicalPathwaysPageComponent
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
            (m) => m.ChemicalDescriptorsPageComponent
          ),
      },
    ],
  },
  {
    path: 'about',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    title: 'RaMP: About',
    loadComponent: () =>
      import('@ramp/features/ramp/ramp-about').then((m) => m.AboutComponent),
  },
  {
    path: 'api',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    title: 'RaMP: API',
    loadComponent: () =>
      import('@ramp/features/ramp/ramp-api').then((m) => m.RampApiComponent),
  },
]
