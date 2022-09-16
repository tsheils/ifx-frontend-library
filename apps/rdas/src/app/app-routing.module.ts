import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'diseases',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
    /* pathMatch: 'full',
     runGuardsAndResolvers: 'paramsOrQueryParamsChange',
     loadChildren: () =>
       import('@ncats-frontend-library/features/rdas/rdas-home').then(
         (m) => m.FeaturesRdasRdasHomeModule
       ),*/
  },{
    path: 'diseases',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadChildren: () =>
      import('@ncats-frontend-library/features/rdas/rdas-browse').then(
        (m) => m.FeaturesRdasRdasBrowseModule
      ),
  },{
    path: 'disease',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadChildren: () =>
      import('@ncats-frontend-library/features/rdas/rdas-disease-page').then(
        (m) => m.FeaturesRdasRdasDiseasePageModule
      ),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
