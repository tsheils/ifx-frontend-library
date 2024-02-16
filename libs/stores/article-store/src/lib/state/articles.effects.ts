import { inject } from "@angular/core";
import { ApolloQueryResult } from "@apollo/client";
import {
  Article,
  ARTICLEDETAILSVARIABLES,
  FETCHARTICLEDETAILS
} from "@ncats-frontend-library/models/rdas";
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import {  filter, map, mergeMap } from "rxjs";
import { ArticleService } from "../article.service";
import { FetchArticleActions } from "./articles.actions";


  export const loadArticle$ = createEffect(
  (
    actions$ = inject(Actions),
    articleService = inject(ArticleService)
  ) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter(
        (r: RouterNavigationAction) =>
          !r.payload.routerState.url.includes('/articles') &&
          r.payload.routerState.url.startsWith('/article')
      ),
      map((r: RouterNavigationAction) => r.payload.routerState.root.queryParams),
      mergeMap((params: { pmid?: string }) => {
        ARTICLEDETAILSVARIABLES.articleWhere.pubmed_id = params.pmid;
        return articleService
          .fetchArticles(FETCHARTICLEDETAILS, ARTICLEDETAILSVARIABLES)
          .pipe(
            map((articleData: ApolloQueryResult<unknown>) => {
              const data: { articles: Article[] } = articleData.data as { articles: Article[] };
              if (data) {
                const article: Article = new Article(
                  data.articles[0]
                );
                return FetchArticleActions.fetchArticleSuccess({ article: article });
              } else
                return FetchArticleActions.fetchArticleFailure({
                  error: 'No Disease found',
                });
            })
          );
      })
    )
  },{functional:true}
  )

