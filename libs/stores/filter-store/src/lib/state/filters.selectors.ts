import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  FILTERS_FEATURE_KEY,
  FiltersState,
  filtersAdapter,
} from './filters.reducer';

// Lookup the 'Filters' feature state managed by NgRx
export const selectFiltersState =
  createFeatureSelector<FiltersState>(FILTERS_FEATURE_KEY);

const { selectAll, selectEntities } = filtersAdapter.getSelectors();

export const selectFiltersLoaded = createSelector(
  selectFiltersState,
  (state: FiltersState) => state.loaded
);

export const selectFiltersError = createSelector(
  selectFiltersState,
  (state: FiltersState) => state.error
);

export const selectAllFilters = createSelector(
  selectFiltersState,
  (state: FiltersState) => selectAll(state)
);

export const selectFiltersEntities = createSelector(
  selectFiltersState,
  (state: FiltersState) => selectEntities(state)
);

export const selectSelectedId = createSelector(
  selectFiltersState,
  (state: FiltersState) => state.selectedId
);

export const selectEntity = createSelector(
  selectFiltersEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
