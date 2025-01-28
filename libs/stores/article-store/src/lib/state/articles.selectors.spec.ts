import {
  Article
} from '@ncats-frontend-library/models/rdas'
import {
  articlesAdapter,
  ArticleStorePartialState,
  initialState,
} from './articles.reducer'
import * as ArticleStoreSelectors from './articles.selectors'

describe('ArticleStore Selectors', () => {
  const ERROR_MSG = 'No Error Available'
  const getArticleStoreId = (it: Article) => it.pubmed_id
  const createArticleStoreEntity = (pubmed_id: string, name = '') =>
    ({
      pubmed_id,
      title: name || `name-${pubmed_id}`,
      DateCreatedRDAS: 'string',
      abstractText: 'string',
      affiliation: 'string',
      citedByCount: 0,
      doi: 'string',
      firstPublicationDate: 'string',
      diseases: [],
      journals: [],
      sources: [],
    } as Article)

  let state: ArticleStorePartialState

  beforeEach(() => {
    state = {
      articles: articlesAdapter.setAll(
        [
          createArticleStoreEntity('PRODUCT-AAA'),
          createArticleStoreEntity('PRODUCT-BBB'),
          createArticleStoreEntity('PRODUCT-CCC'),
        ],
        {
          ...initialState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    }
  })

  describe('ArticleStore Selectors', () => {
    it('selectAllArticleStore() should return the list of ArticleStore', () => {
      const results = ArticleStoreSelectors.selectAllArticles(state)
      const selId = getArticleStoreId(results[1])

      expect(results.length).toBe(3)
      expect(selId).toBe('PRODUCT-BBB')
    })

    it('selectEntity() should return the selected Entity', () => {
      const result = ArticleStoreSelectors.selectEntity(state) as Article
      const selId = getArticleStoreId(result)

      expect(selId).toBe('PRODUCT-BBB')
    })

    it('selectArticleStoreLoaded() should return the current "loaded" status', () => {
      const result = ArticleStoreSelectors.selectArticleStoreLoaded(state)

      expect(result).toBe(true)
    })

    it('selectArticleStoreError() should return the current "error" state', () => {
      const result = ArticleStoreSelectors.selectArticleStoreError(state)

      expect(result).toBe(ERROR_MSG)
    })
  })
})
