import { Disease, DiseaseNode } from '@ncats-frontend-library/models/rdas';
import { FilterCategory, Page } from "@ncats-frontend-library/models/utils";
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import {
  BrowseDiseaseListActions,
  FetchDiseaseActions,
  FetchDiseaseListActions,
  SearchDiseasesActions
} from "./diseases.actions";

export const DISEASES_FEATURE_KEY = 'diseases';

export interface State extends EntityState<Disease> {
  selectedId?: string | number; // which Diseases record has been selected
  loaded: boolean | undefined; // has the Diseases list been loaded
  error?: string | null; // last known error (if any)
  typeahead?: Disease[];
  disease?: Disease;
  page?: Page;
  diseases?: Disease[];
  tree?: DiseaseNode[];
  subscriptions?: Disease[];
  diseaseFilters?: FilterCategory[];
}

export interface DiseasesPartialState {
  readonly [DISEASES_FEATURE_KEY]: State;
}

export const diseasesAdapter: EntityAdapter<Disease> =
  createEntityAdapter<Disease>({
    selectId: (disease) => disease.gardId,
  });

export const initialState: State = diseasesAdapter.getInitialState({
  // set initial required properties
  loaded: false,
  error: 'No Error Available',
  typeahead: [],
  subscriptions: []
});

export const reducer = createReducer(
  initialState,
  on(
    BrowseDiseaseListActions.fetchDiseaseList,
    BrowseDiseaseListActions.setLoading,
    FetchDiseaseActions.fetchDisease,
    (state) =>  {
      return { ...state,
        loaded: false,
        error: null
      }
    }
  ),

  on(BrowseDiseaseListActions.fetchDiseaseTreeSuccess, (state, { diseases }) => ({
    ...state,
    tree: diseases
  })),

  on(BrowseDiseaseListActions.fetchDiseaseListSuccess, (state, { diseases, page }) =>
    diseasesAdapter.setAll(diseases, { ...state, page: page, loaded: true})
  ),

  on(FetchDiseaseActions.fetchDiseaseSuccess, (state, { disease }) =>
    diseasesAdapter.setOne(disease, {
      ...state,
      selectedId: disease.gardId,
      loaded: true,
    })
  ),

  on(SearchDiseasesActions.searchDiseasesSuccess, (state, { typeahead }) => ({
    ...state,
    typeahead: typeahead,
  })),

  on(FetchDiseaseListActions.fetchDiseaseListSuccess, (state, { diseases }) => ({
    ...state,
    subscriptions: diseases,
    loaded: true,
  })),

  on(FetchDiseaseActions.fetchDiseaseFiltersSuccess, (state, { filters }) => ({
    ...state,
    diseaseFilters: filters,
  })),

  on(SearchDiseasesActions.clearTypeahead, (state) => ({
    ...state,
    typeahead: []
  })),

  on(
    BrowseDiseaseListActions.fetchDiseaseListFailure,
    SearchDiseasesActions.searchDiseasesFailure,
    FetchDiseaseActions.fetchDiseaseFailure,
    FetchDiseaseListActions.fetchDiseaseListFailure,
    FetchDiseaseActions.fetchDiseaseFiltersFailure,
    BrowseDiseaseListActions.fetchDiseaseTreeFailure,
    (state, { error }) => ({
      ...state,
      loaded: false,
      error,
    })
  )
);

export function diseasesReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}
