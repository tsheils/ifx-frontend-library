import { Article } from '@ncats-frontend-library/models/rdas';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import {
  FetchArticleActions,
  FetchArticlesListActions,
} from './articles.actions';

import * as ArticleActions from './articles.actions';

export const ARTICLE_STORE_FEATURE_KEY = 'articles';

export interface ArticleState extends EntityState<Article> {
  selectedId?: string | number; // which ArticleStore record has been selected
  loaded: boolean; // has the ArticleStore list been loaded
  error?: string | null; // last known error (if any)
  article?: Article;
  articles?: Article[];
  allArticlesCount: number;
  articlesCount: number;
  epiArticlesCount: number;
  nhsArticlesCount: number;
}

export interface ArticleStorePartialState {
  readonly [ARTICLE_STORE_FEATURE_KEY]: ArticleState;
}

export const articlesAdapter: EntityAdapter<Article> =
  createEntityAdapter<Article>({
    selectId: (article) => article.pubmed_id,
  });

export const initialState: ArticleState = articlesAdapter.getInitialState({
  // set initial required properties
  loaded: false,
  error: 'No Error Available',
  allArticlesCount: 0,
  articlesCount: 0,
  epiArticlesCount: 0,
  nhsArticlesCount: 0,
});

const reducer = createReducer(
  initialState,
  on(FetchArticleActions.fetchArticleSuccess, (state, { article }) =>
    articlesAdapter.setOne(article, {
      ...state,
      selectedId: article.pubmed_id,
      loaded: true,
    }),
  ),

  on(
    FetchArticlesListActions.fetchArticlesListSuccess,
    (
      state,
      {
        articles,
        allArticlesCount,
        articlesCount,
        epiArticlesCount,
        nhsArticlesCount,
      },
    ) =>
      articlesAdapter.setAll(articles, {
        ...state,
        loaded: true,
        allArticlesCount: allArticlesCount || 0,
        articlesCount: articlesCount || 0,
        epiArticlesCount: epiArticlesCount || 0,
        nhsArticlesCount: nhsArticlesCount || 0,
      }),
  ),

  on(FetchArticleActions.fetchArticleFailure, (state, { error }) => ({
    ...state,
    error,
  })),
);

export function articlesReducer(
  state: ArticleState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
