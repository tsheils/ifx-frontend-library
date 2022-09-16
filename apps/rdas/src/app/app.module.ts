import { APP_INITIALIZER, NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule, PERSISTENCE } from "@angular/fire/compat/auth";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { SharedRdasRdasHeaderModule } from "@ncats-frontend-library/shared/rdas/rdas-header";
import { SharedUtilsLoadingSpinnerModule } from "@ncats-frontend-library/shared/utils/loading-spinner";
import { DiseaseService, StoresDiseaseStoreModule } from "@ncats-frontend-library/stores/disease-store";
import { EffectsModule } from "@ngrx/effects";
import { routerReducer, StoreRouterConnectingModule } from "@ngrx/router-store";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from "../environments/environment";
import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';

export function init_connections(diseaseService: DiseaseService) {
  return () => {
    diseaseService.createDriver(environment.neo4jUrl);
  }
}


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    StoresDiseaseStoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    StoreModule.forRoot(
      {
        router: routerReducer
      },
      {
        metaReducers: !environment.production ? [] : [],
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true
        }
      }
    ),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot(),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    GraphQLModule,
    HttpClientModule,
    RouterModule,
    SharedRdasRdasHeaderModule,
    SharedUtilsLoadingSpinnerModule
  ],
  providers: [
    {provide: APP_INITIALIZER, useFactory: init_connections, deps: [DiseaseService], multi: true},
    { provide: PERSISTENCE, useValue: 'local' }
  ],
  bootstrap: [AppComponent],

})
export class AppModule {}
