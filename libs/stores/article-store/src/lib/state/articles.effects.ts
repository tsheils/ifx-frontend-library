import { Injectable, inject } from '@angular/core';
import {
  Article,
  ARTICLEDETAILSVARIABLES,
  ARTICLEVARIABLES,
  Disease,
  DISEASEQUERYPARAMETERS,
  FETCHARTICLEDETAILS,
  FETCHARTICLESQUERY,
  FETCHDISEASEQUERY,
  FETCHPROJECTSQUERY,
  FETCHTRIALSQUERY,
  FETCHTRIALSVARIABLES,
  PROJECTVARIABLES
} from "@ncats-frontend-library/models/rdas";
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from "@ngrx/router-store";
import { Store } from "@ngrx/store";
import { switchMap, catchError, of, filter, map, forkJoin, take } from "rxjs";
import { ArticleService } from "../article.service";
import * as ArticleActions from './articles.actions';
import * as ArticleFeature from './articles.reducer';

@Injectable()
export class ArticlesEffects {

  constructor(
    private actions$: Actions,
    private articleService: ArticleService,
    private store: Store
  ) {}


  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleActions.initArticleStore),
      switchMap(() =>
        of(ArticleActions.loadArticlesSuccess({ articles: [] }))
      ),
      catchError((error) => {
        console.error('Error', error);
        return of(ArticleActions.loadArticlesFailure({ error }));
      })
    )
  );

  loadArticle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r: RouterNavigationAction) => !r.payload.routerState.url.includes('/articles') && r.payload.routerState.url.startsWith('/article')),
      map((r: RouterNavigationAction) => r.payload.routerState.root.queryParams),
      switchMap((params: {pmid?: string}) => {
        ARTICLEDETAILSVARIABLES.articleWhere.pubmed_id =  params.pmid;
        return this.articleService.fetchArticles(FETCHARTICLEDETAILS, ARTICLEDETAILSVARIABLES)
          .pipe(
            map((articleData: any) => {
              console.log(articleData);
              if(articleData.data) {
                const article: Article = new Article(articleData.data.articles[0]);
                return ArticleActions.fetchArticleSuccess({article: article})
              }
              else return ArticleActions.fetchArticleFailure({error: "No Disease found"})
            })
          )
      })
    )}
  );

}
