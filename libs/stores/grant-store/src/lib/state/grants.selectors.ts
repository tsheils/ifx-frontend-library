import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  GRANTS_FEATURE_KEY,
  GrantsState,
  grantsAdapter,
} from './grants.reducer';

// Lookup the 'Grants' feature state managed by NgRx
export const selectGrantsState =
  createFeatureSelector<GrantsState>(GRANTS_FEATURE_KEY);

const { selectAll, selectEntities } = grantsAdapter.getSelectors();

export const selectGrantsLoaded = createSelector(
  selectGrantsState,
  (state: GrantsState) => state.loaded
);

export const selectGrantsError = createSelector(
  selectGrantsState,
  (state: GrantsState) => state.error
);

export const selectAllGrants = createSelector(
  selectGrantsState,
  (state: GrantsState) => selectAll(state)
);

export const selectGrantsEntities = createSelector(
  selectGrantsState,
  (state: GrantsState) => selectEntities(state)
);

export const selectSelectedId = createSelector(
  selectGrantsState,
  (state: GrantsState) => state.selectedId
);

export const selectEntity = createSelector(
  selectGrantsEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
