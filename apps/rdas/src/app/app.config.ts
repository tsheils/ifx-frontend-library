import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule, PERSISTENCE } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import {
  BrowserModule,
  provideClientHydration,
  withNoDomReuse,
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  PreloadAllModules,
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';
import { DiseasesFacade } from '@ncats-frontend-library/stores/disease-store';
import { FiltersFacade } from '@ncats-frontend-library/stores/filter-store';
import { GrantsFacade } from '@ncats-frontend-library/stores/grant-store';
import { TrialsFacade } from '@ncats-frontend-library/stores/trial-store';
import { UsersFacade } from '@ncats-frontend-library/stores/user-store';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { provideStore, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ArticlesFacade } from '@ncats-frontend-library/stores/article-store';
import { environment } from '../environments/environment';

import { routes } from './app.routes';
import { GraphQLModule } from './graphql.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
      withPreloading(PreloadAllModules)
    ),
    provideEffects(),
    provideStore(),
    importProvidersFrom(
      BrowserModule,
      AngularFireModule.initializeApp(environment.firebase),
      AngularFireAuthModule,
      AngularFirestoreModule,
      StoreModule.forRoot(
        {
          router: routerReducer,
        },
        {
          metaReducers: !environment.production ? [] : [],
          runtimeChecks: {
            strictActionImmutability: true,
            strictStateImmutability: true,
          },
        }
      ),
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
    DiseasesFacade,
    ArticlesFacade,
    FiltersFacade,
    GrantsFacade,
    TrialsFacade,
  ],
};
