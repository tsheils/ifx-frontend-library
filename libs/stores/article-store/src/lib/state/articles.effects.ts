import { inject } from '@angular/core'
import { ActivatedRouteSnapshot } from '@angular/router'
import { ApolloQueryResult } from '@apollo/client'
import {
  ALLARTICLES,
  Article,
  ARTICLEDETAILSVARIABLES,
  ClinicalTrial,
  FETCHARTICLEDETAILS,
  FETCHARTICLESQUERY,
} from '@ncats-frontend-library/models/rdas'
import { createEffect, Actions, ofType } from '@ngrx/effects'
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store'
import { filter, map, mergeMap } from 'rxjs'
import { ArticleService } from '../article.service'
import {
  FetchArticleActions,
  FetchArticlesListActions,
} from './articles.actions'

export const loadArticle$ = createEffect(
  (actions$ = inject(Actions), articleService = inject(ArticleService)) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter(
        (r: RouterNavigationAction) =>
          !r.payload.routerState.url.includes('/articles') &&
          r.payload.routerState.url.startsWith('/article')
      ),
      map(
        (r: RouterNavigationAction) => r.payload.routerState.root.queryParams
      ),
      mergeMap((params: { pmid?: string }) => {
        ARTICLEDETAILSVARIABLES.articleWhere.pubmed_id = params.pmid
        return articleService
          .fetchArticles(FETCHARTICLEDETAILS, ARTICLEDETAILSVARIABLES)
          .pipe(
            map((articleData: ApolloQueryResult<unknown>) => {
              const data: { articles: Article[] } = articleData.data as {
                articles: Article[]
              }
              if (data) {
                const article: Article = new Article(data.articles[0])
                return FetchArticleActions.fetchArticleSuccess({
                  article: article,
                })
              } else
                return FetchArticleActions.fetchArticleFailure({
                  error: 'No Disease found',
                })
            })
          )
      })
    )
  },
  { functional: true }
)

export const loadArticlesList$ = createEffect(
  (actions$ = inject(Actions), articleService = inject(ArticleService)) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r: RouterNavigationAction) => {
        return r.payload.routerState.url.includes('/disease')
      }),
      map((r: RouterNavigationAction) => r.payload.routerState.root),
      mergeMap((root: ActivatedRouteSnapshot) => {
        ALLARTICLES.gardWhere.GardId = root.queryParams['id']
        if (root.fragment === 'articles') {
          _setArticlesOptions(root.queryParams)
        }
        return articleService
          .fetchArticles(FETCHARTICLESQUERY, ALLARTICLES)
          .pipe(
            map((articlesData: ApolloQueryResult<unknown>) => {
              const articlesDataArray = articlesData.data as {
                articlesData: {
                  articlesList: Article[]
                  _count: { count: number }
                  allCount: { count: number }
                  epiCount: { count: number }
                  nhsCount: { count: number }
                }[]
              }
              const data = articlesDataArray.articlesData[0]
              const articlesList = data.articlesList.map(
                (article: Partial<Article>) => new Article(article)
              )
              if (articlesList) {
                return FetchArticlesListActions.fetchArticlesListSuccess({
                  articles: articlesList,
                  allArticlesCount: data.allCount.count,
                  articlesCount: data._count.count,
                  epiArticlesCount: data.epiCount.count,
                  nhsArticlesCount: data.nhsCount.count,
                })
              } else
                return FetchArticlesListActions.fetchArticlesListFailure({
                  error: 'No articles found',
                })
            })
          )
      })
    )
  },
  { functional: true }
)

function _setArticlesOptions(options: {
  limit?: number
  offset?: number
  id?: string
  isEpi?: boolean
  isNHS?: boolean
  year?: string[]
}) {
  ALLARTICLES.articleFilter.isEpi = options.isEpi
    ? <boolean>!!options.isEpi
    : false
  ALLARTICLES.articleFilter.isNHS = options.isNHS
    ? <boolean>!!options.isNHS
    : false
  ALLARTICLES.articleOptions.limit = <number>options['limit']
    ? <number>options['limit']
    : 10
  if (<number>options['offset']) {
    ALLARTICLES.articleOptions.offset = <number>options['offset'] * 1
  }
  if (options['year'] && options['year'].length > 0) {
    ALLARTICLES.articleFilter.publicationYear_IN = options['year']
  }
}
