import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { LoadArticlesActions } from "./articles.actions";
import { loadArticle$ } from "./articles.effects";
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

   // effects = TestBed.inject(ArticleEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: LoadArticlesActions.loadArticles });

      const expected = hot('-a-|', {
        a: LoadArticlesActions.loadArticlesSuccess({ articles: [] }),
      });

      expect(loadArticle$).toBeObservable(expected);
    });
  });
});
