import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule, PERSISTENCE } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  PreloadAllModules,
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withPreloading,
  withViewTransitions,
} from '@angular/router';
import { diseasesReducer } from '@ncats-frontend-library/stores/disease-store';
import { usersReducer } from '@ncats-frontend-library/stores/user-store';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { provideStore, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideRouter(
      appRoutes,
      withViewTransitions(),
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
      withPreloading(PreloadAllModules),
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
          users: usersReducer,
          diseases: diseasesReducer,
        },
        {
          metaReducers: !environment.production ? [] : [],
          runtimeChecks: {
            strictActionImmutability: true,
            strictStateImmutability: true,
          },
        },
      ),
      EffectsModule.forRoot([]),
      StoreRouterConnectingModule.forRoot(),
      !environment.production ? StoreDevtoolsModule.instrument() : [],
    ),
    { provide: PERSISTENCE, useValue: 'local' },
    provideAnimations(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    provideClientHydration(),
  ],
};
