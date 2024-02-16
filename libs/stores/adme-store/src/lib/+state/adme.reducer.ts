import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as AdmeActions from './adme.actions';
import { AdmeEntity } from './adme.models';

export const ADME_FEATURE_KEY = 'adme';

export interface AdmeState extends EntityState<AdmeEntity> {
  selectedId?: string | number; // which Adme record has been selected
  loaded: boolean; // has the Adme list been loaded
  error?: string | null; // last known error (if any)
}

export interface AdmePartialState {
  readonly [ADME_FEATURE_KEY]: AdmeState;
}

export const admeAdapter: EntityAdapter<AdmeEntity> =
  createEntityAdapter<AdmeEntity>();

export const initialAdmeState: AdmeState = admeAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const reducer = createReducer(
  initialAdmeState,
  on(AdmeActions.initAdme, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(AdmeActions.loadAdmeSuccess, (state, { adme }) =>
    admeAdapter.setAll(adme, { ...state, loaded: true }),
  ),
  on(AdmeActions.loadAdmeFailure, (state, { error }) => ({ ...state, error })),
);

export function admeReducer(state: AdmeState | undefined, action: Action) {
  return reducer(state, action);
}
