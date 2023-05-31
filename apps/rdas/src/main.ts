import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { appConfig } from "./app/app.config";
import { routes } from "./app/app.routes";


import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { provideRouter, RouterModule, withEnabledBlockingInitialNavigation } from "@angular/router";
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { GraphQLModule } from './app/graphql.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule, provideEffects } from "@ngrx/effects";
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { provideStore, StoreModule } from "@ngrx/store";
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AppRoutingModule } from './app/app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { PERSISTENCE, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { DiseasesFacade, StoresDiseaseStoreModule } from '@ncats-frontend-library/stores/disease-store';
import { UsersFacade, StoresUserStoreModule } from '@ncats-frontend-library/stores/user-store';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  ...appConfig
})
  .catch((err) => console.error(err));
