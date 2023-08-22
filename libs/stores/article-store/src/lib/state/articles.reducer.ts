import { Article } from "@ncats-frontend-library/models/rdas";
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as ArticleActions from './articles.actions';

export const ARTICLE_STORE_FEATURE_KEY = 'articleStore';

export interface ArticleState extends EntityState<Article> {
  selectedId?: string | number; // which ArticleStore record has been selected
  loaded: boolean; // has the ArticleStore list been loaded
  error?: string | null; // last known error (if any)
  article?: Article;
  articles?: Article[];
}

export interface ArticleStorePartialState {
  readonly [ARTICLE_STORE_FEATURE_KEY]: ArticleState;
}


export const articlesAdapter: EntityAdapter<Article> =
  createEntityAdapter<Article>({
    selectId: article => article.pubmed_id
  });

export const initialState: ArticleState = articlesAdapter.getInitialState({
  // set initial required properties
  loaded: false,
  error: 'No Error Available',
});


const reducer = createReducer(
  initialState,
  on(ArticleActions.initArticleStore, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(ArticleActions.fetchArticleSuccess, (state, { article }) =>
    articlesAdapter.setOne(article, { ...state, selectedId: article.pubmed_id, loaded: true })
  ),
  on(ArticleActions.fetchArticleFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export function articlesReducer(
  state: ArticleState | undefined,
  action: Action
) {
  return reducer(state, action);
}
