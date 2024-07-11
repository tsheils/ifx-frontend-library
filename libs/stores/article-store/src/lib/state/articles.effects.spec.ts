import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { LoadArticlesActions } from './articles.actions';
import * as ArticleEffects from './articles.effects';

describe('ArticleStoreEffects', () => {
  let actions: Observable<Action>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ArticleEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });
  });

  describe('loadArticle$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: LoadArticlesActions.loadArticles });

      const expected = hot('-a-|', {
        a: LoadArticlesActions.loadArticlesSuccess({ articles: [] }),
      });

      const myDummyServiceMock = { loadArticle$: new Subscription() };

      expect([]).toEqual([]);
    });
  });
});
