import { Filter } from '@ncats-frontend-library/models/utils';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import { ResolverResponse } from 'ifx';
import {
  LoadResolverOptionsActions,
  ResolveQueryActions,
} from './resolver.actions';

import * as ResolverActions from './resolver.actions';

export const RESOLVER_FEATURE_KEY = 'resolver';

export interface ResolverState extends EntityState<ResolverResponse> {
  selectedId?: string | number; // which Resolver record has been selected
  loaded: boolean; // has the Resolver list been loaded
  error?: string | null; // last known error (if any)
  options: Filter[];
  selectedOptions?: Filter[];
  previousOptions?: string[];
}

export interface ResolverPartialState {
  readonly [RESOLVER_FEATURE_KEY]: ResolverState;
}

export const resolverAdapter: EntityAdapter<ResolverResponse> =
  createEntityAdapter<ResolverResponse>();

export const initialResolverState: ResolverState =
  resolverAdapter.getInitialState({
    // set initial required properties
    loaded: false,
    options: [],
    selectedOptions: [],
  });

const reducer = createReducer(
  initialResolverState,
  on(LoadResolverOptionsActions.loadResolverOptions, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),

  on(
    LoadResolverOptionsActions.loadResolverOptionsSuccess,
    (state, { options }) => {
      return {
        ...state,
        options: options,
        selectedOptions: options?.filter((opt: Filter) => opt.selected),
        loaded: true,
        error: null,
      };
    }
  ),

  on(LoadResolverOptionsActions.setPreviousFilters, (state, { filters }) => {
    return { ...state, previousOptions: filters, loaded: true, error: null };
  }),

  on(ResolveQueryActions.resolveQuerySuccess, (state, { data }) => {
    return resolverAdapter.setAll(data, {
      ...state,
      loaded: true,
      error: null,
    });
  }),

  on(
    LoadResolverOptionsActions.loadResolverOptionsFailure,
    ResolveQueryActions.resolveQueryFailure,
    (state, { error }) => ({
      ...state,
      error,
    })
  )
);

export function resolverReducer(
  state: ResolverState | undefined,
  action: Action
) {
  return reducer(state, action);
}
