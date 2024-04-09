import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    redirectTo: 'toolbox'
  },
  {
    path: 'toolbox',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('default-tool').then(
        (m) => m.DefaultToolComponent,
      )
  },
  {
    path: 'toolbox/ncatsfind-excel',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('ncats-find-excel').then(
        (m) => m.NcatsFindExcelComponent,
      )
  },
  {
    path: 'toolbox/chemkit',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('chemkit').then(
        (m) => m.ChemkitComponent,
      )
  },
  {
    path: 'toolbox/iqc-convert',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('iqc-convert').then(
        (m) => m.IqcConvertComponent,
      )
  },
  {
    path: 'toolbox/qhts-data-browser',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('qhts-data-browser').then(
        (m) => m.QhtsDataBrowserComponent,
      )
  },
  {
    path: 'toolbox/qhts-heatmap-browser',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('qhts-heatmap-browser').then(
        (m) => m.QhtsHeatmapBrowserComponent,
      )
  },{
    path: 'toolbox/qhts-plate-browser',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('qhts-plate-browser').then(
        (m) => m.QhtsPlateBrowserComponent,
      )
  },{
    path: 'toolbox/qhts-sample-client',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('qhts-sample-client').then(
        (m) => m.QhtsSampleClientComponent,
      )
  },{
    path: 'toolbox/scaffold-hopper',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('scaffold-hopper').then(
        (m) => m.ScaffoldHopperComponent,
      )
  },
  {
    path: 'toolbox/:id',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('default-tool').then(
        (m) => m.DefaultToolComponent,
      )
  },
];
