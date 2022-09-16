import { Disease } from "@ncats-frontend-library/models/rdas";
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as DiseasesActions from './diseases.actions';

export const DISEASES_FEATURE_KEY = 'diseases';

export interface State extends EntityState<Disease> {
  selectedId?: string | number; // which Diseases record has been selected
  loaded: boolean; // has the Diseases list been loaded
  error?: string | null; // last known error (if any)
  typeahead?: Disease[];
  disease?: Disease;
}

export interface DiseasesPartialState {
  readonly [DISEASES_FEATURE_KEY]: State;
}

export const diseasesAdapter: EntityAdapter<Disease> =
  createEntityAdapter<Disease>({
    selectId: disease => disease.gard_id
  });

export const initialState: State = diseasesAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const diseasesReducer = createReducer(
  initialState,
  on(DiseasesActions.init, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),

  on(DiseasesActions.loadDiseasesSuccess, (state, { diseases }) => {
      console.log(state);
      console.log(diseases);
      return diseasesAdapter.setAll(diseases, {...state, loaded: true})
    }
  ),

  on(DiseasesActions.searchDiseasesSuccess, (state, { typeahead }) => {
      return diseasesAdapter.setAll(typeahead, {...state, loaded: true})
    }
  ),
  on(DiseasesActions.fetchDiseaseSuccess, (state, { disease }) => {
      return diseasesAdapter.setOne(disease, {...state, selectedId: disease.gard_id, loaded: true})
    }
  ),

  on(
    DiseasesActions.loadDiseasesFailure,
    DiseasesActions.searchDiseasesFailure,
    DiseasesActions.fetchDiseaseFailure,
    (state, { error }) => ({
      ...state,
      error,
    }))
);

export function reducer(state: State | undefined, action: Action) {
  return diseasesReducer(state, action);
}
