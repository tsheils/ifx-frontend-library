import { provideHttpClient, withFetch, withInterceptorsFromDi } from "@angular/common/http";
import { APP_INITIALIZER, ApplicationConfig, inject } from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation, withInMemoryScrolling, withPreloading,
  withViewTransitions
} from "@angular/router";
import { provideEffects } from "@ngrx/effects";
import { provideRouterStore, routerReducer } from "@ngrx/router-store";
import { provideState, provideStore, Store } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { ResolverEffects, LoadResolverOptionsActions, RESOLVER_FEATURE_KEY, resolverReducer, ResolverService } from "resolver-store";
import { environment } from "../environments/environment";
import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

export function load_resolver(resolverService: ResolverService, store = inject(Store)) {
  return () => {
    resolverService._setOptionsUrl(environment.resolverOptionsUrl);
    resolverService._setResolverUrl(environment.resolverUrl);
    store.dispatch(LoadResolverOptionsActions.loadResolverOptions());
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: load_resolver,
      deps: [ResolverService],
      multi: true,
    },
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
      resolver: resolverReducer
    }),
    provideRouterStore(),
    provideStoreDevtools(),
    provideState(
      RESOLVER_FEATURE_KEY,
      resolverReducer
    ),
    provideEffects(ResolverEffects),
    provideAnimations(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi(), withFetch())
  ],
};
