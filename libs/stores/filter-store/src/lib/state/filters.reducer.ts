import { FilterCategory } from '@ncats-frontend-library/models/utils';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import { FetchFiltersActions } from './filters.actions';

import * as FiltersActions from './filters.actions';

export const FILTERS_FEATURE_KEY = 'filters';

export interface FiltersState extends EntityState<FilterCategory> {
  selectedId?: string | number; // which Filters record has been selected
  loaded: boolean; // has the Filters list been loaded
  error?: string | null; // last known error (if any)
  filters?: FilterCategory[];
}

export interface FiltersPartialState {
  readonly [FILTERS_FEATURE_KEY]: FiltersState;
}

export const filtersAdapter: EntityAdapter<FilterCategory> =
  createEntityAdapter<FilterCategory>({
    selectId: (filterCategory) => filterCategory.label,
  });

export const initialFiltersState: FiltersState = filtersAdapter.getInitialState(
  {
    // set initial required properties
    loaded: false,
  }
);

const reducer = createReducer(
  initialFiltersState,

  on(FetchFiltersActions.fetchFiltersSuccess, (state, { filters }) =>
    filtersAdapter.upsertMany(filters, {
      ...state,
      loaded: true
    })
  ),
  on(FetchFiltersActions.fetchFiltersFailure, (state, { error }) => ({
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
