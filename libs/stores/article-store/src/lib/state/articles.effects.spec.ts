import { TestBed } from '@angular/core/testing'
import { Article } from '@ncats-frontend-library/models/rdas';
import { provideMockActions } from '@ngrx/effects/testing'
import { Action } from '@ngrx/store'
import { provideMockStore } from '@ngrx/store/testing'
import { hot } from 'jasmine-marbles'
import { EMPTY, Observable, Subscription } from 'rxjs'
import { FetchArticleActions } from './articles.actions'
import * as ArticleEffects from './articles.effects'

describe('ArticleStoreEffects', () => {
  let actions: Observable<Action>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ArticleEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    })
  })

  describe('loadArticle$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: FetchArticleActions.fetchArticle })

      const expected = hot('-a-|', {
        a: FetchArticleActions.fetchArticleSuccess({ article: {  } as Article }),
      })

      const myDummyServiceMock = { loadArticle$: new Subscription() }

      expect([]).toEqual([])
    })
  })
})
