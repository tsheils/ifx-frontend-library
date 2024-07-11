import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  DISEASES_FEATURE_KEY,
  diseasesAdapter,
  State,
} from './diseases.reducer';

// Lookup the 'Diseases' feature state managed by NgRx
export const getDiseasesState =
  createFeatureSelector<State>(DISEASES_FEATURE_KEY);

const { selectAll, selectEntities } = diseasesAdapter.getSelectors();

export const getDiseasesLoaded = createSelector(
  getDiseasesState,
  (state: State) => state.loaded,
);

export const getDiseasesError = createSelector(
  getDiseasesState,
  (state: State) => state.error,
);

export const getAllDiseases = createSelector(getDiseasesState, (state: State) =>
  selectAll(state),
);

/*
export const searchDiseasesEntities = createSelector(
  getDiseasesState,
  (state: State) =>  selectAll(state)
);
*/

export const searchDiseasesEntities = createSelector(
  getDiseasesState,
  (state: State) => state.typeahead,
);

export const getDiseasesEntities = createSelector(
  getDiseasesState,
  (state: State) => selectEntities(state),
);

export const getSelectedId = createSelector(
  getDiseasesState,
  (state: State) => state.selectedId,
);

export const getDiseasesPage = createSelector(
  getDiseasesState,
  (state: State) => state.page,
);

export const getDiseasesSubscriptions = createSelector(
  getDiseasesState,
  (state: State) => state.subscriptions,
);

export const getDiseaseTree = createSelector(
  getDiseasesState,
  (state: State) => state.tree,
);

export const getDiseaseFilters = createSelector(
  getDiseasesState,
  (state: State) => state.diseaseFilters,
);

export const getStaticDiseaseFilters = createSelector(
  getDiseasesState,
  (state: State) => state.staticDiseaseFilters,
);

export const getAllDiseaseFilters = createSelector(
  getDiseasesState,
  (state: State) => state.allDiseaseFilters,
);

export const getSelected = createSelector(
  getDiseasesEntities,
  getSelectedId,
  (entities, selectedId) => {
    return selectedId ? entities[selectedId] : undefined;
  },
);
