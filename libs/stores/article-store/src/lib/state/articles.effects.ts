
import { inject } from '@angular/core';
import {ActivatedRouteSnapshot, Params} from '@angular/router';
import { ObservableQuery } from '@apollo/client';
import {
    Article,
   ArticleQueryFactory
} from 'rdas-models';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import {concatMap, filter, map, mergeMap, switchMap} from 'rxjs';
import { ArticleService } from '../article.service';
import {
  FetchArticleActions,
  FetchArticlesListActions,
} from './articles.actions';
import { concatLatestFrom } from '@ngrx/operators';
import { DiseaseSelectors } from 'disease-store';
import { Store } from '@ngrx/store';
const queryFactory = new ArticleQueryFactory();

interface ArticleQueryResponse {
  diseases:
    {
      countArticles: number;
      countEpiArticles: number;
      countNhsArticles: number;
      articles: Article[];
      allCount: {
        totalCount: number
      }
    }[]
}

export const loadArticlesList$ = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    articleService = inject(ArticleService),
  ) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      concatLatestFrom(() => store.select(DiseaseSelectors.getSelected)),
      filter(([r, data]) => {
        return (
          (!r.payload.routerState.url.includes('/diseases') &&
          r.payload.routerState.url.includes('/disease')) && (!data || r.payload.routerState.root.fragment === 'articles')
        );
      }),
      map(([r, data]) => {
        return r.payload.routerState.root.queryParams;
      }),
      switchMap((params) => {
        const query = queryFactory.getQuery(params);
        return articleService.fetchArticles(query.query, query.params).pipe(
          map((res: ObservableQuery.Result<unknown>) => {
            if (res && res.data) {
              const data = (res.data as ArticleQueryResponse).diseases![0];
              const articlesList = data.articles.map(
                (article: Partial<Article>) => new Article(article),
              );
              return FetchArticlesListActions.fetchArticlesListSuccess({
                articles: articlesList,
                allArticlesCount: data!.allCount!.totalCount,
                articlesCount: data.countArticles!,
                epiArticlesCount: data.countEpiArticles!,
                nhsArticlesCount: data.countNhsArticles!,
              });
            } else
              return FetchArticlesListActions.fetchArticlesListFailure({
                error: 'No articles found',
              });
          }),
        );
      }),
    );
  },
  { functional: true },
);

export const loadArticle$ = createEffect(
  (actions$ = inject(Actions), articleService = inject(ArticleService)) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter(
        (r: RouterNavigationAction) =>
          !r.payload.routerState.url.includes('/articles') &&
          r.payload.routerState.url.startsWith('/article'),
      ),
      map(
        (r: RouterNavigationAction) => r.payload.routerState.root.queryParams,
      ),
      switchMap((params) => {
        const query = queryFactory.getQuery(params);
        return articleService.fetchArticles(query.query, query.params).pipe(
          map((articleData: ObservableQuery.Result<unknown>) => {
            const data: { articles: Article[] } = articleData.data as {
              articles: Article[];
            };
            if (data) {
              const article: Article = new Article(data.articles[0]);
              return FetchArticleActions.fetchArticleSuccess({
                article: article,
              });
            } else
              return FetchArticleActions.fetchArticleFailure({
                error: 'No Disease found',
              });
          }),
        );
      }),
    );
  },
  { functional: true },
);
