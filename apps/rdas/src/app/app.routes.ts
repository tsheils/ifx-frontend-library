import { Routes } from '@angular/router';
import {
  ARTICLE_STORE_FEATURE_KEY,
  ArticleEffects,
  articlesReducer,
} from '@ncats-frontend-library/stores/article-store';
import {
  FILTERS_FEATURE_KEY,
  FilterEffects,
  filtersReducer,
} from '@ncats-frontend-library/stores/filter-store';
import {
  GRANTS_FEATURE_KEY,
  GrantEffects,
  grantsReducer,
} from '@ncats-frontend-library/stores/grant-store';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { environment } from '../environments/environment';
import {
  TrialEffects,
  TRIALS_FEATURE_KEY,
  trialsReducer,
} from '@ncats-frontend-library/stores/trial-store';

export const routes: Routes = [
  {
    path: '',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/rdas-home').then(
        (m) => m.RdasHomeComponent,
      ),
  },
  {
    path: 'diseases',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/rdas-browse').then(
        (m) => m.RdasBrowseComponent,
      ),
  },
  {
    path: 'disease',
    pathMatch: 'full',
    runGuardsAndResolvers: 'pathParamsChange',
    /* providers: [
      importProvidersFrom(
        // register feature reducer
        StoreModule.forFeature('diseaseStore', diseasesReducer),
        // run feature effects
        EffectsModule.forFeature([DiseasesEffects])
      ),
    ],*/
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/rdas-disease-page').then(
        (m) => m.RdasDiseasePageComponent,
      ),
  },
  {
    path: 'about',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/rdas-about').then(
        (m) => m.FeaturesRdasRdasAboutComponent,
      ),
  },
  {
    path: 'privacy',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/privacy-page').then(
        (m) => m.RdasPrivacyPageComponent,
      ),
  },
  {
    path: 'article',
    pathMatch: 'full',
    providers: [
      provideState(ARTICLE_STORE_FEATURE_KEY, articlesReducer),
      provideEffects(ArticleEffects),
    ],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/rdas-article-page').then(
        (m) => m.FeaturesRdasRdasArticlePageComponent,
      ),
  },
  {
    path: 'grant',
    pathMatch: 'full',
    providers: [
      provideState(GRANTS_FEATURE_KEY, grantsReducer),
      provideEffects(GrantEffects),
    ],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/rdas-grant-page').then(
        (m) => m.RdasGrantPageComponent,
      ),
  },
  {
    path: 'trial',
    pathMatch: 'full',
    providers: [
      provideState(TRIALS_FEATURE_KEY, trialsReducer),
      provideEffects(TrialEffects),
    ],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/rdas-trial-page').then(
        (m) => m.RdasTrialPageComponent,
      ),
  },
  {
    path: 'subscriptions',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ncats-frontend-library/features/rdas/rdas-subscriptions').then(
        (m) => m.RdasSubscriptionsComponent,
      ),
  },
  {
    path: 'apis/diseases',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: {
      instance: `${environment.baseUrl}${
        environment.production ? '/' : ':4000/'
      }api/diseases`,
    },
    loadComponent: () =>
      // eslint-disable-next-line @nx/enforce-module-boundaries
      import('@ncats-frontend-library/features/rdas/graphql-sandbox').then(
        (m) => m.GraphqlSandboxComponent,
      ),
  },
  {
    path: 'apis/publications',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: {
      instance: `${environment.baseUrl}${
        environment.production ? '/' : ':4001/'
      }api/articles`,
    },
    loadComponent: () =>
      // eslint-disable-next-line @nx/enforce-module-boundaries
      import('@ncats-frontend-library/features/rdas/graphql-sandbox').then(
        (m) => m.GraphqlSandboxComponent,
      ),
  },
  {
    path: 'apis/projects',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: {
      instance: `${environment.baseUrl}${
        environment.production ? '/' : ':4002/'
      }api/grants`,
    },
    loadComponent: () =>
      // eslint-disable-next-line @nx/enforce-module-boundaries
      import('@ncats-frontend-library/features/rdas/graphql-sandbox').then(
        (m) => m.GraphqlSandboxComponent,
      ),
  },
  {
    path: 'apis/trials',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: {
      instance: `${environment.baseUrl}${
        environment.production ? '/' : ':4003/'
      }api/trials`,
    },
    loadComponent: () =>
      // eslint-disable-next-line @nx/enforce-module-boundaries
      import('@ncats-frontend-library/features/rdas/graphql-sandbox').then(
        (m) => m.GraphqlSandboxComponent,
      ),
  },
  {
    path: 'apis/epi',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      // eslint-disable-next-line @nx/enforce-module-boundaries
      import('@ncats-frontend-library/features/rdas/epi-api').then(
        (m) => m.EpiApiComponent,
      ),
  },
  {
    path: 'apis/history',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      // eslint-disable-next-line @nx/enforce-module-boundaries
      import('@ncats-frontend-library/features/rdas/history-api').then(
        (m) => m.HistoryApiComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];

/* RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      //onSameUrlNavigation: 'reload',
    })
    */
