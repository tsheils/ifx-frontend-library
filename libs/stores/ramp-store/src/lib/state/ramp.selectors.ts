import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RAMP_FEATURE_KEY, RampState, rampAdapter } from './ramp.reducer';

// Lookup the 'Ramp' feature state managed by NgRx
export const selectRampState =
  createFeatureSelector<RampState>(RAMP_FEATURE_KEY);

const { selectAll, selectEntities } = rampAdapter.getSelectors();

export const selectRampLoaded = createSelector(
  selectRampState,
  (state: RampState) => state.loaded,
);

export const selectRampError = createSelector(
  selectRampState,
  (state: RampState) => state.error,
);

export const selectAllRamp = createSelector(
  selectRampState,
  (state: RampState) => selectAll(state),
);

export const selectRampEntities = createSelector(
  selectRampState,
  (state: RampState) => selectEntities(state),
);

export const selectSelectedId = createSelector(
  selectRampState,
  (state: RampState) => state.selectedId,
);

export const selectEntity = createSelector(
  selectRampEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined),
);
