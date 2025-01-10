import {
  HttpClient,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
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
import { provideMarkdown } from 'ngx-markdown';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {
  IFXToolsEffects,
  ifxToolsReducer,
  IFX_TOOLS_FEATURE_KEY,
  IfxToolsService,
  LoadToolsActions,
} from 'ifx-tool-store';

export function fetch_data(ifxToolsService: IfxToolsService) {
  return () => {
    ifxToolsService._loadData(environment.toolFileUrl);
  };
}

export function ifxToolsInit(store = inject(Store)) {
  return () => {
    store.dispatch(LoadToolsActions.loadTools());
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
        const initializerFn = (fetch_data)(inject(IfxToolsService));
        return initializerFn();
      }),
    provideAppInitializer(() => {
        const initializerFn = (ifxToolsInit)();
        return initializerFn();
      }),
    provideMarkdown(),
    provideRouter(
      appRoutes,
      withViewTransitions(),
      withComponentInputBinding(),
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
      withPreloading(PreloadAllModules),
    ),
    provideStore({
      router: routerReducer,
      ifxTools: ifxToolsReducer,
    }),
    provideRouterStore(),
    provideStoreDevtools(),
    provideState(IFX_TOOLS_FEATURE_KEY, ifxToolsReducer),
    provideEffects(IFXToolsEffects),
    provideAnimations(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    provideClientHydration(),
  ],
};
