import { Routes } from '@angular/router';
import { STRUCTURE_VIEWER_COMPONENT, StructureViewerComponent } from "structure-viewer";
import { environment } from '../environments/environment';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('ramp-main').then((m) => m.RampMainComponent),
    //  import('@ramp/features/ramp/ramp-home').then((m) => m.HomeComponent),
  },{
    path: 'biochemical-pathways',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('ramp-main').then((m) => m.RampMainComponent),
    children: [
      {
        path: "",
        loadComponent: () =>
          import('biochemical-pathways-page').then((m) => m.BiochemicalPathwaysPageComponent),
      }
      ]
    //  import('@ramp/features/ramp/ramp-home').then((m) => m.HomeComponent),
  },{
    path: 'analytes',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('ramp-main').then((m) => m.RampMainComponent),
    children: [
      {
        path: "",
        loadComponent: () =>
          import('analytes-page').then((m) => m.AnalytesPageComponent),
      }
    ]
  },{
    path: 'ontologies',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('ramp-main').then((m) => m.RampMainComponent),
    children: [
      {
        path: "",
        loadComponent: () =>
          import('ontologies-page').then((m) => m.OntologiesPageComponent),
      }
    ]
  },
  {
    path: 'reactions',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('ramp-main').then((m) => m.RampMainComponent),
    children: [
      {
        path: "",
        loadComponent: () =>
          import('reactions-page').then((m) => m.ReactionsPageComponent),
      }
    ]
  },
  {
    path: 'chemical-properties',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('ramp-main').then((m) => m.RampMainComponent),
    children: [
      {
        providers: [
          { provide: STRUCTURE_VIEWER_COMPONENT, useValue: StructureViewerComponent },
        ],
        data: {
          renderUrl: environment.rendererUrl,
        },
        path: "",
        loadComponent: () =>
          import('chemical-properties-page').then((m) => m.ChemicalPropertiesPageComponent),
      }
    ]
  },
  {
    path: 'about',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ramp/features/ramp/ramp-about').then((m) => m.AboutComponent),
  },
  {
    path: 'api',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ramp/features/ramp/ramp-api').then((m) => m.RampApiComponent),
  }
];
