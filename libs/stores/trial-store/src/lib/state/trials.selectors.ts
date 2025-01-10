import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  TRIALS_FEATURE_KEY,
  TrialsState,
  trialsAdapter,
} from './trials.reducer';

// Lookup the 'Trials' feature state managed by NgRx
export const selectTrialsState =
  createFeatureSelector<TrialsState>(TRIALS_FEATURE_KEY);

const { selectAll, selectEntities } = trialsAdapter.getSelectors();

export const selectTrialsLoaded = createSelector(
  selectTrialsState,
  (state: TrialsState) => state.loaded,
);

export const selectTrialsError = createSelector(
  selectTrialsState,
  (state: TrialsState) => state.error,
);

export const selectAllTrials = createSelector(
  selectTrialsState,
  (state: TrialsState) => selectAll(state),
);

export const selectTrialsEntities = createSelector(
  selectTrialsState,
  (state: TrialsState) => selectEntities(state),
);

export const selectSelectedId = createSelector(
  selectTrialsState,
  (state: TrialsState) => state.selectedId,
);

export const getTrialCount = createSelector(
  selectTrialsState,
  (state: TrialsState) => state.allTrialCount,
);

export const selectEntity = createSelector(
  selectTrialsEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined),
);
