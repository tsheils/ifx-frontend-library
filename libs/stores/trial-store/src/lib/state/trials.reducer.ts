import { ClinicalTrial } from '@ncats-frontend-library/models/rdas';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import { FetchTrialActions, LoadTrialsActions } from './trials.actions';

import * as TrialsActions from './trials.actions';

export const TRIALS_FEATURE_KEY = 'trials';

export interface TrialsState extends EntityState<ClinicalTrial> {
  selectedId?: string | number; // which Trials record has been selected
  loaded: boolean; // has the Trials list been loaded
  error?: string | null; // last known error (if any)
  trial?: ClinicalTrial;
  trials?: ClinicalTrial[];
}

export interface TrialsPartialState {
  readonly [TRIALS_FEATURE_KEY]: TrialsState;
}

export const trialsAdapter: EntityAdapter<ClinicalTrial> =
  createEntityAdapter<ClinicalTrial>({
    selectId: (trial) => trial.NCTId,
  });

export const initialTrialsState: TrialsState = trialsAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const reducer = createReducer(
  initialTrialsState,
  on(LoadTrialsActions.loadTrialsSuccess, (state, { trials }) =>
    trialsAdapter.setAll(trials, { ...state, loaded: true }),
  ),

  on(FetchTrialActions.fetchTrialSuccess, (state, { trial }) =>
    trialsAdapter.setOne(trial, {
      ...state,
      selectedId: trial.NCTId,
      loaded: true,
    }),
  ),

  on(
    LoadTrialsActions.loadTrialsFailure,
    FetchTrialActions.fetchTrialFailure,
    (state, { error }) => ({
      ...state,
      error,
    }),
  ),
);

export function trialsReducer(state: TrialsState | undefined, action: Action) {
  return reducer(state, action);
}
