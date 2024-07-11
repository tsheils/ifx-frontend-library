import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  ARTICLE_STORE_FEATURE_KEY,
  articlesAdapter,
  ArticleState,
} from './articles.reducer';

// Lookup the 'ArticleStore' feature state managed by NgRx
export const selectArticleStoreState = createFeatureSelector<ArticleState>(
  ARTICLE_STORE_FEATURE_KEY,
);

const { selectAll, selectEntities } = articlesAdapter.getSelectors();

export const selectArticleStoreLoaded = createSelector(
  selectArticleStoreState,
  (state: ArticleState) => state.loaded,
);

export const selectArticleStoreError = createSelector(
  selectArticleStoreState,
  (state: ArticleState) => state.error,
);

export const selectAllArticleStore = createSelector(
  selectArticleStoreState,
  (state: ArticleState) => selectAll(state),
);

export const selectArticleStoreEntities = createSelector(
  selectArticleStoreState,
  (state: ArticleState) => {
    return selectEntities(state);
  },
);

export const selectSelectedId = createSelector(
  selectArticleStoreState,
  (state: ArticleState) => state.selectedId,
);

export const selectEntity = createSelector(
  selectArticleStoreEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined),
);
