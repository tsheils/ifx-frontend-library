import { Disease } from "@ncats-frontend-library/models/rdas";
import { Page } from "@ncats-frontend-library/models/utils";
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Diseases Page] Init');

export const loadDiseases = createAction(
  '[Diseases/API] Load Diseases',
  props<{
    top: number
    skip: number
  }>()
);

export const loadDiseasesSuccess = createAction(
  '[Diseases/API] Load Diseases Success',
  props<{
    diseases: Disease[],
    page?: Page
  }>()
);

export const loadDiseasesFailure = createAction(
  '[Diseases/API] Load Diseases Failure',
  props<{ error: string }>()
);

export const searchDiseases = createAction(
  '[Diseases/API] Search Diseases',
  props<{ term: string }>()
);

export const searchDiseasesSuccess = createAction(
  '[Diseases/API] Search Diseases Success',
  props<{ typeahead: Disease[] }>()
);

export const searchDiseasesFailure = createAction(
  '[Diseases/API] Search Diseases Failure',
  props<{ error: string }>()
);

export const fetchDisease = createAction(
  '[Diseases/API] fetch Disease',
  props<{
    gard_id: string,
    source: string,
    options?: { [key: string]: string }
  }>()
);

export const fetchDiseaseSuccess = createAction(
  '[Diseases/API] fetch Disease Success',
  props<{ disease: Disease }>()
);

export const fetchDiseaseFailure = createAction(
  '[Diseases/API] fetch Disease Failure',
  props<{ error: string }>()
);
