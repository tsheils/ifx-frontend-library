import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  IFX_TOOLS_FEATURE_KEY,
  IfxToolsState,
  ifxToolsAdapter,
} from './ifx-tools.reducer';

// Lookup the 'IfxTools' feature state managed by NgRx
export const selectIfxToolsState = createFeatureSelector<IfxToolsState>(
  IFX_TOOLS_FEATURE_KEY,
);

const { selectAll, selectEntities } = ifxToolsAdapter.getSelectors();

export const selectIfxToolsLoaded = createSelector(
  selectIfxToolsState,
  (state: IfxToolsState) => state.loaded,
);

/*
export const selectIfxTools = createSelector(
  selectIfxToolsState,
  (state: IfxToolsState) => state.tools,
);
*/

export const selectIfxToolsAudience = createSelector(
  selectIfxToolsState,
  (state: IfxToolsState) => state.audienceList,
);

export const selectIfxToolsCategories = createSelector(
  selectIfxToolsState,
  (state: IfxToolsState) => state.categoryList,
);

export const selectIfxToolsError = createSelector(
  selectIfxToolsState,
  (state: IfxToolsState) => state.error,
);

export const selectAllIfxTools = createSelector(
  selectIfxToolsState,
  (state: IfxToolsState) => selectAll(state),
);

export const selectIfxToolsEntities = createSelector(
  selectIfxToolsState,
  (state: IfxToolsState) => selectEntities(state),
);

export const selectSelectedId = createSelector(
  selectIfxToolsState,
  (state: IfxToolsState) => state.selectedId,
);

export const selectEntity = createSelector(
  selectIfxToolsEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined),
);
