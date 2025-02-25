import { Filter } from '@ncats-frontend-library/models/utils';
import { Action } from '@ngrx/store';
import { SearchFiltersActions } from './filters.actions';

import {
  FiltersState,
  initialFiltersState,
  filtersReducer,
} from './filters.reducer';

describe('Filters Reducer', () => {
  const createFiltersEntity = (id: string, name = ''): Filter =>
    <Filter>{
      label: id,
      term: id,
    };

  describe('valid Filters actions', () => {
    it('loadFiltersSuccess should return the list of known Filters', () => {
      const filters = [
        createFiltersEntity('PRODUCT-AAA'),
        createFiltersEntity('PRODUCT-zzz'),
      ];
      const action = SearchFiltersActions.searchFiltersSuccess({
        filters: filters,
      });

      const result: FiltersState = filtersReducer(initialFiltersState, action);

      expect(result.loaded).toBe(false);
      expect(result.ids.length).toBe(0);
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
