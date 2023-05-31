import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule, PERSISTENCE } from "@angular/fire/compat/auth";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { BrowserModule, provideClientHydration } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter, withEnabledBlockingInitialNavigation } from "@angular/router";
import { DiseasesFacade, StoresDiseaseStoreModule } from "@ncats-frontend-library/stores/disease-store";
import { StoresUserStoreModule, UsersFacade } from "@ncats-frontend-library/stores/user-store";
import { EffectsModule, provideEffects } from "@ngrx/effects";
import { routerReducer, StoreRouterConnectingModule } from "@ngrx/router-store";
import { provideStore, StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from "../environments/environment";

import { routes } from './app.routes';
import { GraphQLModule } from "./graphql.module";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideEffects(),
    provideStore(),
    importProvidersFrom(
      BrowserModule,
      AngularFireModule.initializeApp(environment.firebase),
      AngularFireAuthModule,
      AngularFirestoreModule,
      StoreModule.forRoot({
        router: routerReducer
      }, {
        metaReducers: !environment.production ? [] : [],
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true
        }
      }),
      EffectsModule.forRoot([]),
      StoreRouterConnectingModule.forRoot(),
      !environment.production ? StoreDevtoolsModule.instrument() : [],
      GraphQLModule
    ),
    { provide: PERSISTENCE, useValue: 'local' },
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideClientHydration(),
    UsersFacade,
    DiseasesFacade
  ]
};
