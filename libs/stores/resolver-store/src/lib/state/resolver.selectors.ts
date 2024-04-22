import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  RESOLVER_FEATURE_KEY,
  ResolverState,
  resolverAdapter,
} from './resolver.reducer';

// Lookup the 'Resolver' feature state managed by NgRx
export const selectResolverState =
  createFeatureSelector<ResolverState>(RESOLVER_FEATURE_KEY);

const { selectAll, selectEntities } = resolverAdapter.getSelectors();

export const selectResolverLoaded = createSelector(
  selectResolverState,
  (state: ResolverState) => state.loaded,
);

export const selectResolverOptions = createSelector(
  selectResolverState,
  (state: ResolverState) => state.options,
);

export const selectResolverError = createSelector(
  selectResolverState,
  (state: ResolverState) => state.error,
);

export const selectAllResolver = createSelector(
  selectResolverState,
  (state: ResolverState) => selectAll(state),
);

export const selectResolverEntities = createSelector(
  selectResolverState,
  (state: ResolverState) => selectEntities(state),
);

export const selectSelectedId = createSelector(
  selectResolverState,
  (state: ResolverState) => state.selectedId,
);

export const fetchPreviousFilters = createSelector(
  selectResolverState,
  (state: ResolverState) => state.previousOptions,
);

export const selectEntity = createSelector(
  selectResolverEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined),
);
