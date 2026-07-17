import { ClinicalTrial } from 'rdas-models';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import { FetchTrialActions, FetchTrialsListActions } from './trials.actions';

export const TRIALS_FEATURE_KEY = 'clinicalTrials';

export interface TrialsState extends EntityState<ClinicalTrial> {
  selectedId?: string | number; // which Trials record has been selected
  loaded: boolean; // has the Trials list been loaded
  error?: string | null; // last known error (if any)
  trial?: ClinicalTrial;
  clinicalTrials?: ClinicalTrial[];
  allClinicalTrialsCount: number;
  clinicalTrialsCount: number;
}

export interface TrialsPartialState {
  readonly [TRIALS_FEATURE_KEY]: TrialsState;
}

export const trialsAdapter: EntityAdapter<ClinicalTrial> =
  createEntityAdapter<ClinicalTrial>({
    selectId: (trial) => trial.nctId,
  });

export const initialTrialsState: TrialsState = trialsAdapter.getInitialState({
  // set initial required properties
  loaded: false,
  error: 'No Error Available',
  allClinicalTrialsCount: 0,
  clinicalTrialsCount: 0,
});

const reducer = createReducer(
  initialTrialsState,
  on(
    FetchTrialsListActions.fetchTrialsListSuccess,
    (state, { clinicalTrials, allClinicalTrialsCount, clinicalTrialsCount }) =>
      trialsAdapter.setAll(clinicalTrials, {
        ...state,
        loaded: true,
        allClinicalTrialsCount: allClinicalTrialsCount || 0,
        clinicalTrialsCount: clinicalTrialsCount || 0,
      }),
  ),

  on(FetchTrialActions.fetchTrialSuccess, (state: TrialsState, { trial }) =>
    trialsAdapter.setOne(trial, {
      ...state,
      selectedId: trial.nctId,
      loaded: true,
      error: '',
    }),
  ),

  on(
    FetchTrialsListActions.fetchTrialsListFailure,
    FetchTrialActions.fetchTrialFailure,
    (state: TrialsState, { error }) => ({
      ...state,
      error,
    }),
  ),
);

export function trialsReducer(state: TrialsState | undefined, action: Action) {
  return reducer(state, action);
}
