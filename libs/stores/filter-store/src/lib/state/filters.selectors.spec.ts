import { FiltersEntity } from './filters.models';
import {
  filtersAdapter,
  FiltersPartialState,
  initialFiltersState,
} from './filters.reducer';
import * as FiltersSelectors from './filters.selectors';

describe('Filters Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getFiltersId = (it: FiltersEntity) => it.id;
  const createFiltersEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as FiltersEntity);

  let state: FiltersPartialState;

  beforeEach(() => {
    state = {
      filters: filtersAdapter.setAll(
        [
          createFiltersEntity('PRODUCT-AAA'),
          createFiltersEntity('PRODUCT-BBB'),
          createFiltersEntity('PRODUCT-CCC'),
        ],
        {
          ...initialFiltersState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('Filters Selectors', () => {
    it('selectAllFilters() should return the list of Filters', () => {
      const results = FiltersSelectors.selectAllFilters(state);
      const selId = getFiltersId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = FiltersSelectors.selectEntity(state) as FiltersEntity;
      const selId = getFiltersId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectFiltersLoaded() should return the current "loaded" status', () => {
      const result = FiltersSelectors.selectFiltersLoaded(state);

      expect(result).toBe(true);
    });

    it('selectFiltersError() should return the current "error" state', () => {
      const result = FiltersSelectors.selectFiltersError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
