import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nx/angular/testing';

import * as ArticleStoreActions from './articles.actions';
import { ArticlesEffects } from './articles.effects';
import { ArticlesFacade } from './articles.facade';
import { ArticleStoreEntity } from './article-store.models';
import {
  ARTICLE_STORE_FEATURE_KEY,
  ArticleStoreState,
  initialArticleStoreState,
  articlesReducer,
} from './articles.reducer';
import * as ArticleStoreSelectors from './articles.selectors';

interface TestSchema {
  articleStore: ArticleStoreState;
}

describe('ArticleStoreFacade', () => {
  let facade: ArticlesFacade;
  let store: Store<TestSchema>;
  const createArticleStoreEntity = (
    id: string,
    name = ''
  ): ArticleStoreEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(
            ARTICLE_STORE_FEATURE_KEY,
            articlesReducer
          ),
          EffectsModule.forFeature([ArticlesEffects]),
        ],
        providers: [ArticlesFacade],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule,
        ],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.inject(Store);
      facade = TestBed.inject(ArticlesFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allArticleStore$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allArticleStore$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadArticleStoreSuccess` to manually update list
     */
    it('allArticleStore$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allArticleStore$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        ArticleStoreActions.loadArticleStoreSuccess({
          articleStore: [
            createArticleStoreEntity('AAA'),
            createArticleStoreEntity('BBB'),
          ],
        })
      );

      list = await readFirst(facade.allArticleStore$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
