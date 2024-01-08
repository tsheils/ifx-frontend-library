import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FilterCategory } from '@ncats-frontend-library/models/utils';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nx/angular/testing';

import * as FiltersActions from './filters.actions';
import { FiltersEffects } from './filters.effects';
import { FiltersFacade } from './filters.facade';
import {
  FILTERS_FEATURE_KEY,
  FiltersState,
  filtersReducer,
} from './filters.reducer';

interface TestSchema {
  filters: FiltersState;
}

describe('FiltersFacade', () => {
  let facade: FiltersFacade;
  let store: Store<TestSchema>;
  const createFiltersEntity = (label: string, values = []): FilterCategory =>
    <FilterCategory>{
      label,
      values,
    };

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(FILTERS_FEATURE_KEY, filtersReducer),
          EffectsModule.forFeature([FiltersEffects]),
        ],
        providers: [FiltersFacade],
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
      facade = TestBed.inject(FiltersFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allFilters$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allFilters$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadFiltersSuccess` to manually update list
     */
    it('allFilters$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allFilters$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        FiltersActions.loadFiltersSuccess({
          filters: [createFiltersEntity('AAA'), createFiltersEntity('BBB')],
        })
      );

      list = await readFirst(facade.allFilters$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
