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
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withPreloading,
  withViewTransitions,
} from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideState, provideStore, Store } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import {
  LoadRampActions,
  RampService,
  RampEffects,
  rampReducer,
  RAMP_STORE_FEATURE_KEY,
} from 'ramp-store';
import { environment } from '../environments/environment';

import { routes } from './app.routes';

export function set_url(rampService: RampService) {
  return () => {
    rampService._setUrl(environment.apiBaseUrl);
    rampService._setRendererUrl(environment.rendererUrl);
  };
}

export function rampInit(store = inject(Store)) {
  return () => {
    store.dispatch(LoadRampActions.loadRamp());
    store.dispatch(
      LoadRampActions.loadRampApi({
        url: '/assets/data/ramp-api.json',
      }),
    );
    store.dispatch(LoadRampActions.loadRampStats());
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    BrowserModule,
    provideAppInitializer(() => {
      const initializerFn = set_url(inject(RampService));
      return initializerFn();
    }),
    provideAppInitializer(() => {
      const initializerFn = rampInit();
      return initializerFn();
    }),
    provideRouter(
      routes,
      withViewTransitions(),
      withComponentInputBinding(),
      // s withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
      withPreloading(PreloadAllModules),
    ),
    provideStore({ rampStore: rampReducer }),
    provideRouterStore(),
    provideStoreDevtools(),
    provideEffects([RampEffects]),
    provideState(RAMP_STORE_FEATURE_KEY, rampReducer),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
  ],
};
