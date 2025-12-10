import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer, provideZonelessChangeDetection
} from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withPreloading,
  withViewTransitions,
} from '@angular/router';
import { InMemoryCache } from '@apollo/client/core';
import {
  ARTICLE_STORE_FEATURE_KEY,
  ArticleEffects,
  articlesReducer,
} from 'article-store';
import {
  DiseaseEffects,
  DISEASES_FEATURE_KEY,
  diseasesReducer,
} from 'disease-store';
import {
  FILTERS_FEATURE_KEY,
  filtersReducer,
  FilterEffects,
} from 'filter-store';
import {
  PROJECTS_FEATURE_KEY,
  projectsReducer,
  ProjectEffects,
} from 'grant-store';
import {
  TRIALS_FEATURE_KEY,
  trialsReducer,
  TrialEffects,
} from 'trial-store';
import {
  USERS_FEATURE_KEY,
  usersReducer,
  UserEffects,
  RdasUsersInitActions,
} from 'user-store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideState, provideStore, Store } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideNamedApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { environment } from '../environments/environment';

import { routes } from './app.routes';

export function rdasInit(store = inject(Store)) {
  return () => {
    store.dispatch(RdasUsersInitActions.init());
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    BrowserModule,
    provideAppInitializer(() => {
      const initializerFn = rdasInit();
      return initializerFn();
    }),
    provideRouter(
      routes,
      withViewTransitions(),
      withComponentInputBinding(),
      //withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
      withPreloading(PreloadAllModules)
    ),
    provideStore({
      router: routerReducer,
      user: usersReducer,
      articles: articlesReducer,
      trials: trialsReducer,
      projects: projectsReducer,
      filters: filtersReducer,
      diseases: diseasesReducer,
    }),
    provideEffects([
      UserEffects,
      ArticleEffects,
      DiseaseEffects,
      FilterEffects,
      TrialEffects,
      ProjectEffects,
    ]),
    provideState(ARTICLE_STORE_FEATURE_KEY, articlesReducer),
    provideState(PROJECTS_FEATURE_KEY, projectsReducer),
    provideState(TRIALS_FEATURE_KEY, trialsReducer),
    provideState(DISEASES_FEATURE_KEY, diseasesReducer),
    provideState(USERS_FEATURE_KEY, usersReducer),
    provideState(FILTERS_FEATURE_KEY, filtersReducer),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
   // provideAnimations(),
  //  provideAnimationsAsync(),
    provideRouterStore(),
    provideStoreDevtools(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    provideClientHydration(),
    provideZonelessChangeDetection(),
    provideNamedApollo(() => {
      const httpLink = inject(HttpLink);
      return {
        diseases: {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: `${environment.baseUrl}${
              environment.production ? '/' : ':7687/'
            }api/diseases`,
          }),
        },
        articles: {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: `${environment.baseUrl}${
              environment.production ? '/' : ':7690/'
            }api/articles`,
          }),
        },
        projects: {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: `${environment.baseUrl}${
              environment.production ? '/' : ':7689/'
            }api/projects`,
          }),
        },
        trials: {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: `${environment.baseUrl}${
              environment.production ? '/' : ':7688/'
            }api/trials`,
          }),
        },
      };
    }),
  ],
};
