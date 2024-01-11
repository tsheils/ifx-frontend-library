import { inject, Injectable } from "@angular/core";
import { ApolloQueryResult } from "@apollo/client";
import {
  Article,
  ARTICLEDETAILSVARIABLES,
  FETCHARTICLEDETAILS
} from "@ncats-frontend-library/models/rdas";
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { switchMap, catchError, of, filter, map } from "rxjs";
import { ArticleService } from '../article.service';
import * as ArticleActions from './articles.actions';

@Injectable()
export class ArticlesEffects {
  constructor(
    private articleService: ArticleService
  ) {}

  init$ = createEffect(() =>
    inject(Actions).pipe(
      ofType(ArticleActions.initArticleStore),
      switchMap(() => of(ArticleActions.loadArticlesSuccess({ articles: [] }))),
      catchError((error) => {
        console.error('Error', error);
        return of(ArticleActions.loadArticlesFailure({ error }));
      })
    )
  );

  loadArticle$ = createEffect(() =>
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
              map((articleData: ApolloQueryResult<unknown>) => {
                const data: {articles: Article[]} = articleData.data as {articles: Article[]};
                if (data) {
                const article: Article = new Article(
                  data.articles[0]
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
