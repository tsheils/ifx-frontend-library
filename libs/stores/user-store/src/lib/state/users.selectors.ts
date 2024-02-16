import { createFeatureSelector, createSelector } from '@ngrx/store';
import { USERS_FEATURE_KEY, UserState, usersAdapter } from './users.reducer';
// Lookup the 'Users' feature state managed by NgRx
export const getUsersState = createFeatureSelector<UserState>(USERS_FEATURE_KEY);

const { selectAll, selectEntities } = usersAdapter.getSelectors();

export const getUsersLoaded = createSelector(
  getUsersState,
  (state: UserState) => state.loaded
);

export const getUsersError = createSelector(
  getUsersState,
  (state: UserState) => state.error
);

export const getEmail = createSelector(getUsersState, (state: UserState) => {
  return state.email;
});

export const getAllUsers = createSelector(getUsersState, (state: UserState) =>
  selectAll(state)
);

export const getUser = createSelector(getUsersState, (state: UserState) =>
  selectAll(state)[0]
);

export const getUsersEntities = createSelector(getUsersState, (state: UserState) =>
  selectEntities(state)
);

export const getSelectedId = createSelector(
  getUsersState,
  (state: UserState) => state.selectedId
);

export const getSelected = createSelector(
  getUsersEntities,
  getSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
