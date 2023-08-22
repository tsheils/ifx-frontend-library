import { Action } from '@ngrx/store';

import * as ArticleStoreActions from './articles.actions';
import { ArticleStoreEntity } from './article-store.models';
import {
  ArticleStoreState,
  initialArticleStoreState,
  articlesReducer,
} from './articles.reducer';

describe('ArticleStore Reducer', () => {
  const createArticleStoreEntity = (
    id: string,
    name = ''
  ): ArticleStoreEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid ArticleStore actions', () => {
    it('loadArticleStoreSuccess should return the list of known ArticleStore', () => {
      const articleStore = [
        createArticleStoreEntity('PRODUCT-AAA'),
        createArticleStoreEntity('PRODUCT-zzz'),
      ];
      const action = ArticleStoreActions.loadArticleStoreSuccess({
        articleStore,
      });

      const result: ArticleStoreState = articlesReducer(
        initialArticleStoreState,
        action
      );

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = articlesReducer(initialArticleStoreState, action);

      expect(result).toBe(initialArticleStoreState);
    });
  });
});
