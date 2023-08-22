import { ArticleStoreEntity } from './article-store.models';
import {
  articleStoreAdapter,
  ArticleStorePartialState,
  initialArticleStoreState,
} from './articles.reducer';
import * as ArticleStoreSelectors from './articles.selectors';

describe('ArticleStore Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getArticleStoreId = (it: ArticleStoreEntity) => it.id;
  const createArticleStoreEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as ArticleStoreEntity);

  let state: ArticleStorePartialState;

  beforeEach(() => {
    state = {
      articleStore: articleStoreAdapter.setAll(
        [
          createArticleStoreEntity('PRODUCT-AAA'),
          createArticleStoreEntity('PRODUCT-BBB'),
          createArticleStoreEntity('PRODUCT-CCC'),
        ],
        {
          ...initialArticleStoreState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('ArticleStore Selectors', () => {
    it('selectAllArticleStore() should return the list of ArticleStore', () => {
      const results = ArticleStoreSelectors.selectAllArticleStore(state);
      const selId = getArticleStoreId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = ArticleStoreSelectors.selectEntity(
        state
      ) as ArticleStoreEntity;
      const selId = getArticleStoreId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectArticleStoreLoaded() should return the current "loaded" status', () => {
      const result = ArticleStoreSelectors.selectArticleStoreLoaded(state);

      expect(result).toBe(true);
    });

    it('selectArticleStoreError() should return the current "error" state', () => {
      const result = ArticleStoreSelectors.selectArticleStoreError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
