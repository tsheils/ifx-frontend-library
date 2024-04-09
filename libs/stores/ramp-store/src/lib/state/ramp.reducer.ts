import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as RampActions from './ramp.actions';
import { RampEntity } from './ramp.models';

export const RAMP_FEATURE_KEY = 'ramp';

export interface RampState extends EntityState<RampEntity> {
  selectedId?: string | number; // which Ramp record has been selected
  loaded: boolean; // has the Ramp list been loaded
  error?: string | null; // last known error (if any)
}

export interface RampPartialState {
  readonly [RAMP_FEATURE_KEY]: RampState;
}

export const rampAdapter: EntityAdapter<RampEntity> =
  createEntityAdapter<RampEntity>();

export const initialRampState: RampState = rampAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const reducer = createReducer(
  initialRampState,
  on(RampActions.initRamp, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(RampActions.loadRampSuccess, (state, { ramp }) =>
    rampAdapter.setAll(ramp, { ...state, loaded: true }),
  ),
  on(RampActions.loadRampFailure, (state, { error }) => ({ ...state, error })),
);

export function rampReducer(state: RampState | undefined, action: Action) {
  return reducer(state, action);
}
