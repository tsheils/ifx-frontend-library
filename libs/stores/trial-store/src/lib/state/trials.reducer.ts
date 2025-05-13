import { ClinicalTrial } from '@ncats-frontend-library/models/rdas';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import { FetchTrialActions, FetchTrialsListActions } from './trials.actions';

export const TRIALS_FEATURE_KEY = 'trials';

export interface TrialsState extends EntityState<ClinicalTrial> {
  selectedId?: string | number; // which Trials record has been selected
  loaded: boolean; // has the Trials list been loaded
  error?: string | null; // last known error (if any)
  trial?: ClinicalTrial;
  trials?: ClinicalTrial[];
  allTrialCount: number;
  count: number;
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
  allTrialCount: 0,
  count: 0
});

const reducer = createReducer(
  initialTrialsState,
  on(
    FetchTrialsListActions.fetchTrialsListSuccess,
    (state, { trials, allTrialCount, count }) =>
      trialsAdapter.setAll(trials, {
        ...state,
        loaded: true,
        allTrialCount: allTrialCount || 0,
        count: count || 0,
      })
  ),

  on(FetchTrialActions.fetchTrialSuccess, (state, { trial }) =>
    trialsAdapter.setOne(trial, {
      ...state,
      selectedId: trial.NCTId,
      loaded: true,
    })
  ),

  on(
    FetchTrialsListActions.fetchTrialsListFailure,
    FetchTrialActions.fetchTrialFailure,
    (state, { error }) => ({
      ...state,
      error,
    })
  )
);

export function trialsReducer(state: TrialsState | undefined, action: Action) {
  return reducer(state, action);
}
