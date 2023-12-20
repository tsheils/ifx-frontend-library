import { inject, Injectable } from "@angular/core";
import { ApolloQueryResult } from '@apollo/client';
import {
  Article,
  ARTICLEDETAILSVARIABLES, ARTICLEFILTERS,
  FETCHARTICLEDETAILS
} from "@ncats-frontend-library/models/rdas";
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { switchMap, catchError, of, filter, map, forkJoin, take } from "rxjs";
import { ArticleService } from '../article.service';
import * as ArticleActions from './articles.actions';

@Injectable()
export class ArticlesEffects {
  constructor(
    private articleService: ArticleService
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  init$ = createEffect((): any =>
    inject(Actions).pipe(
      ofType(ArticleActions.initArticleStore),
      switchMap(() => of(ArticleActions.loadArticlesSuccess({ articles: [] }))),
      catchError((error) => {
        console.error('Error', error);
        return of(ArticleActions.loadArticlesFailure({ error }));
      })
    )
  );

 // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadArticle$ = createEffect((): any =>
    inject(Actions).pipe(
      ofType(ROUTER_NAVIGATION),
      filter(
        (r: RouterNavigationAction) =>
          !r.payload.routerState.url.includes('/articles') &&
          r.payload.routerState.url.startsWith('/article')
      ),
      map(
        (r: RouterNavigationAction) => r.payload.routerState.root.queryParams
      ),
      switchMap((params: { pmid?: string }) => {
        ARTICLEDETAILSVARIABLES.articleWhere.pubmed_id = params.pmid;
        return this.articleService
          .fetchArticles(FETCHARTICLEDETAILS, ARTICLEDETAILSVARIABLES)
          .pipe(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            map((articleData: any) => {
              if (articleData.data) {
                const article: Article = new Article(
                  articleData.data.articles[0]
                );
                return ArticleActions.fetchArticleSuccess({ article: article });
              } else
                return ArticleActions.fetchArticleFailure({
                  error: 'No Disease found',
                });
            })
          );
      })
    )
  );
}
