import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as FiltersActions from './filters.actions';
import { FiltersEntity } from './filters.models';

export const FILTERS_FEATURE_KEY = 'filters';

export interface FiltersState extends EntityState<FiltersEntity> {
  selectedId?: string | number; // which Filters record has been selected
  loaded: boolean; // has the Filters list been loaded
  error?: string | null; // last known error (if any)
}

export interface FiltersPartialState {
  readonly [FILTERS_FEATURE_KEY]: FiltersState;
}

export const filtersAdapter: EntityAdapter<FiltersEntity> =
  createEntityAdapter<FiltersEntity>();

export const initialFiltersState: FiltersState = filtersAdapter.getInitialState(
  {
    // set initial required properties
    loaded: false,
  }
);

const reducer = createReducer(
  initialFiltersState,
  on(FiltersActions.initFilters, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(FiltersActions.loadFiltersSuccess, (state, { filters }) =>
    filtersAdapter.setAll(filters, { ...state, loaded: true })
  ),
  on(FiltersActions.loadFiltersFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export function filtersReducer(
  state: FiltersState | undefined,
  action: Action
) {
  return reducer(state, action);
}
