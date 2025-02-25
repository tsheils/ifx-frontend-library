import { isPlatformBrowser } from '@angular/common';
import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  PLATFORM_ID,
  provideAppInitializer,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withPreloading,
  withViewTransitions,
} from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideState, provideStore, Store } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import {
  ResolverEffects,
  LoadResolverOptionsActions,
  RESOLVER_FEATURE_KEY,
  resolverReducer,
  ResolverService,
} from 'resolver-store';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

export function load_resolver(
  resolverService: ResolverService,
  store = inject(Store)
) {
  return () => {
    resolverService._setOptionsUrl(environment.resolverOptionsUrl);
    resolverService._setResolverUrl(environment.resolverUrl);
    resolverService._setextraString(environment.extraString);
    store.dispatch(LoadResolverOptionsActions.loadResolverOptions());
  };
}

export function load_from_local_storage(
  platformId = inject(PLATFORM_ID),
  store = inject(Store)
) {
  return () => {
    if (isPlatformBrowser(platformId)) {
      if (localStorage && localStorage.getItem('previouslyUsedOptions')) {
        const temp: string = <string>(
          localStorage.getItem('previouslyUsedOptions')
        );
        if (temp) {
          const filterOptionsList = JSON.parse(temp);
          if (filterOptionsList && filterOptionsList.length) {
            store.dispatch(
              LoadResolverOptionsActions.setPreviousFilters({
                filters: filterOptionsList,
              })
            );
          }
        }
      }
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    BrowserModule,
    provideAppInitializer(() => {
      const initializerFn = load_from_local_storage();
      return initializerFn();
    }),
    provideAppInitializer(() => {
      const initializerFn = load_resolver(inject(ResolverService));
      return initializerFn();
    }),
    provideClientHydration(),
    provideRouter(
      appRoutes,
      withViewTransitions(),
      withComponentInputBinding(),
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
      withPreloading(PreloadAllModules)
    ),
    provideStore({
      router: routerReducer,
      resolver: resolverReducer,
    }),
    provideRouterStore(),
    provideStoreDevtools(),
    provideState(RESOLVER_FEATURE_KEY, resolverReducer),
    provideEffects(ResolverEffects),
    provideAnimations(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
  ],
};
