import { Action } from '@ngrx/store';

import * as FiltersActions from './filters.actions';
import { FiltersEntity } from './filters.models';
import {
  FiltersState,
  initialFiltersState,
  filtersReducer,
} from './filters.reducer';

describe('Filters Reducer', () => {
  const createFiltersEntity = (id: string, name = ''): FiltersEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid Filters actions', () => {
    it('loadFiltersSuccess should return the list of known Filters', () => {
      const filters = [
        createFiltersEntity('PRODUCT-AAA'),
        createFiltersEntity('PRODUCT-zzz'),
      ];
      const action = FiltersActions.loadFiltersSuccess({ filters });

      const result: FiltersState = filtersReducer(initialFiltersState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = filtersReducer(initialFiltersState, action);

      expect(result).toBe(initialFiltersState);
    });
  });
});
