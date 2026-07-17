import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideStabilityDebugging,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  PreloadAllModules,
  withComponentInputBinding,
  withInMemoryScrolling,
  withPreloading,
  withViewTransitions,
} from '@angular/router';
import { appRoutes } from './app.routes';
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideState, provideStore, Store } from '@ngrx/store';
import {
  RdasUsersInitActions,
  USERS_FEATURE_KEY,
  UserEffects,
  usersReducer,
} from 'user-store';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client';
import {
  DISEASES_FEATURE_KEY,
  diseasesReducer,
  DiseaseEffects,
} from 'disease-store';
import { TRIALS_FEATURE_KEY, trialsReducer, TrialEffects } from 'trial-store';
import {
  ARTICLE_STORE_FEATURE_KEY,
  articlesReducer,
  ArticleEffects,
} from 'article-store';
import {
  FILTERS_FEATURE_KEY,
  filtersReducer,
  FilterEffects,
} from 'filter-store';
import {
  PROJECTS_FEATURE_KEY,
  projectsReducer,
  ProjectEffects,
} from 'project-store';

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
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      appRoutes,
      withViewTransitions(),
      withComponentInputBinding(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
      withPreloading(PreloadAllModules),
    ),
    provideZonelessChangeDetection(),
    provideStore({
      users: usersReducer,
      diseases: diseasesReducer,
      filters: filtersReducer,
      articles: articlesReducer,
      clinicalTrials: trialsReducer,
      projects: projectsReducer,
    }),
    provideState(USERS_FEATURE_KEY, usersReducer),
    provideState(DISEASES_FEATURE_KEY, diseasesReducer),
    provideState(FILTERS_FEATURE_KEY, filtersReducer),
    provideState(ARTICLE_STORE_FEATURE_KEY, articlesReducer),
    provideState(TRIALS_FEATURE_KEY, trialsReducer),
    provideState(PROJECTS_FEATURE_KEY, projectsReducer),
    provideEffects([
      UserEffects,
      DiseaseEffects,
      FilterEffects,
      ArticleEffects,
      TrialEffects,
      ProjectEffects,
    ]),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideRouterStore(),
    provideStoreDevtools(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      return {
        ssrMode: true,
        cache: new InMemoryCache(),
        link: httpLink.create({
          uri: environment.baseUrl+'/api/diseases',
        }),
      };
    }),
  ],
};
