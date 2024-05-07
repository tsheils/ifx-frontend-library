import {
  provideHttpClient, withFetch,
  withInterceptorsFromDi
} from "@angular/common/http";
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, inject } from "@angular/core";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { getStorage, provideStorage } from "@angular/fire/storage";
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  PreloadAllModules,
  provideRouter, withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withPreloading, withViewTransitions
} from "@angular/router";
import {
  DiseaseEffects, DISEASES_FEATURE_KEY,
  diseasesReducer
} from "@ncats-frontend-library/stores/disease-store";
import {
  USERS_FEATURE_KEY,
  usersReducer,
  UserEffects,
  RdasUsersInitActions
} from "@ncats-frontend-library/stores/user-store";
import { provideEffects } from "@ngrx/effects";
import { provideRouterStore, routerReducer } from "@ngrx/router-store";
import { provideState, provideStore, Store } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { environment } from '../environments/environment';

import { routes } from './app.routes';
import { GraphQLModule } from './graphql.module';

export function rdasInit(store = inject(Store)) {
  return () => {
    store.dispatch(RdasUsersInitActions.init());
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    BrowserModule,
    {
      provide: APP_INITIALIZER,
      useFactory: rdasInit,
      deps: [],
      multi: true,
    },
    provideRouter(
      routes,
      withViewTransitions(),
      withComponentInputBinding(),
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({
        anchorScrolling: "enabled",
        scrollPositionRestoration: "enabled"
      }),
      withPreloading(PreloadAllModules)
    ),
  //  provideEffects([UserEffects, DiseasesEffects]),
    provideStore({
      router: routerReducer,
      user: usersReducer,
    //  articles: articlesReducer,
    //  trials: trialsReducer,
    //  grants: grantsReducer,
   //   filters: filtersReducer,
      diseases: diseasesReducer
    }),
    provideEffects([UserEffects, DiseaseEffects]),
    provideState(DISEASES_FEATURE_KEY, diseasesReducer),
    provideState(USERS_FEATURE_KEY, usersReducer),
    importProvidersFrom(
      GraphQLModule,
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      provideStorage(() => getStorage()),
    ),
    provideAnimations(),
    provideAnimationsAsync(),
    provideRouterStore(),
    provideStoreDevtools(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    provideClientHydration(),
  ]
};
