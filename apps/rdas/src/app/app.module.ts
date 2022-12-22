import { NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule, PERSISTENCE } from "@angular/fire/compat/auth";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { RdasSearchComponent } from "@ncats-frontend-library/shared/rdas/rdas-search";
import { FooterTemplateComponent } from "@ncats-frontend-library/shared/utils/footer-template";
import { SharedUtilsHeaderTemplateModule } from "@ncats-frontend-library/shared/utils/header-template";
import { SharedUtilsLoadingSpinnerModule } from "@ncats-frontend-library/shared/utils/loading-spinner";
import { SharedSocialSignOnModule } from "@ncats-frontend-library/shared/utils/social-sign-on";
import { DiseasesFacade, StoresDiseaseStoreModule } from "@ncats-frontend-library/stores/disease-store";
import { StoresUserStoreModule, UsersFacade } from "@ncats-frontend-library/stores/user-store";
import { EffectsModule } from "@ngrx/effects";
import { routerReducer, StoreRouterConnectingModule } from "@ngrx/router-store";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from "../environments/environment";
import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    StoresDiseaseStoreModule,
    StoresUserStoreModule,
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
    SharedUtilsLoadingSpinnerModule,
    SharedUtilsHeaderTemplateModule,
    SharedSocialSignOnModule,
    RdasSearchComponent,
    FooterTemplateComponent
  ],
  providers: [
    UsersFacade,
    DiseasesFacade,
    { provide: PERSISTENCE, useValue: 'local' }
  ],
  bootstrap: [AppComponent],

})
export class AppModule {}
