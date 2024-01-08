import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GraphqlSandboxComponent } from './graphql-sandbox/graphql-sandbox.component';

const ROUTES: Routes = [
  {
    path: '',
    component: GraphqlSandboxComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(ROUTES)],
  declarations: [GraphqlSandboxComponent],
})
export class FeaturesRdasGraphqlSandboxModule {}
