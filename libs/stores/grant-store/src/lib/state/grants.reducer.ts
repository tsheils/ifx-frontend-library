import { CoreProject } from "@ncats-frontend-library/models/rdas";
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as GrantsActions from './grants.actions';

export const GRANTS_FEATURE_KEY = 'grants';

export interface GrantsState extends EntityState<CoreProject> {
  selectedId?: string | number; // which Grants record has been selected
  loaded: boolean; // has the Grants list been loaded
  error?: string | null; // last known error (if any)
  grant?: CoreProject;
  grants?: CoreProject[];
}

export interface GrantsPartialState {
  readonly [GRANTS_FEATURE_KEY]: GrantsState;
}

export const grantsAdapter: EntityAdapter<CoreProject> =
  createEntityAdapter<CoreProject>(
    {
      selectId: grant => grant.core_project_num
    }
  );

export const initialGrantsState: GrantsState = grantsAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const reducer = createReducer(
  initialGrantsState,
  on(GrantsActions.initGrants, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(GrantsActions.loadGrantsSuccess, (state, { grants }) =>
    grantsAdapter.setAll(grants, { ...state, loaded: true })
  ),

  on(GrantsActions.fetchGrantSuccess, (state, { grant }) =>
    grantsAdapter.setOne(grant, { ...state, selectedId:grant.core_project_num, loaded: true })
  ),
  on(
    GrantsActions.loadGrantsFailure,
    GrantsActions.fetchGrantFailure,
    (state, { error }) => ({
    ...state,
    error,
  }))
);

export function grantsReducer(state: GrantsState | undefined, action: Action) {
  return reducer(state, action);
}
