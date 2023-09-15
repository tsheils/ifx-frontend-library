import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CoreProject } from "@ncats-frontend-library/models/rdas";
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nx/angular/testing';

import * as GrantsActions from './grants.actions';
import { GrantsEffects } from './grants.effects';
import { GrantsFacade } from './grants.facade';
import {
  GRANTS_FEATURE_KEY,
  GrantsState,
  grantsReducer,
} from './grants.reducer';

interface TestSchema {
  grants: GrantsState;
}

describe('GrantsFacade', () => {
  let facade: GrantsFacade;
  let store: Store<TestSchema>;
  const createGrantsEntity = (id: string, name = ''): CoreProject => ( new CoreProject({
    core_project_num: id,
    name: name || `name-${id}`,
  })
  );

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(GRANTS_FEATURE_KEY, grantsReducer),
          EffectsModule.forFeature([GrantsEffects]),
        ],
        providers: [GrantsFacade],
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
      facade = TestBed.inject(GrantsFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allGrants$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allGrants$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadGrantsSuccess` to manually update list
     */
    it('allGrants$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allGrants$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        GrantsActions.loadGrantsSuccess({
          grants: [createGrantsEntity('AAA'), createGrantsEntity('BBB')],
        })
      );

      list = await readFirst(facade.allGrants$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
