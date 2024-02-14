import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ADME_FEATURE_KEY, AdmeState, admeAdapter } from './adme.reducer';

// Lookup the 'Adme' feature state managed by NgRx
export const selectAdmeState =
  createFeatureSelector<AdmeState>(ADME_FEATURE_KEY);

const { selectAll, selectEntities } = admeAdapter.getSelectors();

export const selectAdmeLoaded = createSelector(
  selectAdmeState,
  (state: AdmeState) => state.loaded,
);

export const selectAdmeError = createSelector(
  selectAdmeState,
  (state: AdmeState) => state.error,
);

export const selectAllAdme = createSelector(
  selectAdmeState,
  (state: AdmeState) => selectAll(state),
);

export const selectAdmeEntities = createSelector(
  selectAdmeState,
  (state: AdmeState) => selectEntities(state),
);

export const selectSelectedId = createSelector(
  selectAdmeState,
  (state: AdmeState) => state.selectedId,
);

export const selectEntity = createSelector(
  selectAdmeEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined),
);
