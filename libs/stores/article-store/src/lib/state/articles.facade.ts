import { Injectable } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import * as ArticleActions from './articles.actions';
import * as ArticleFeature from './articles.reducer';
import * as ArticleStoreSelectors from './articles.selectors';

@Injectable()
export class ArticlesFacade {
  constructor(private store: Store<ArticleFeature.ArticleStorePartialState>) {
  }
  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(
    select(ArticleStoreSelectors.selectArticleStoreLoaded)
  );
  allArticles$ = this.store.pipe(
    select(ArticleStoreSelectors.selectAllArticleStore)
  );
  selectedArticle$ = this.store.pipe(
    select(ArticleStoreSelectors.selectEntity)
  );

  dispatch(action: Action) {
    this.store.dispatch(action);
  }

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(ArticleActions.initArticleStore());
  }
}
