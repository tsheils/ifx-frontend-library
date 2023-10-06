import { Disease, DiseaseNode, Gene, Phenotype } from "@ncats-frontend-library/models/rdas";
import { Filter, FilterCategory, Page } from "@ncats-frontend-library/models/utils";
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Diseases Page] Init');

export const loading = createAction('[Loading] start');

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
  props<{ error: string | null | undefined }>()
);

export const loadDiseaseTreeSuccess = createAction(
  '[Diseases/API] Load Disease Tree Success',
  props<{
    diseases: DiseaseNode[]
  }>()
);

export const loadDiseaseTreeFailure = createAction(
  '[Diseases/API] Load Disease Tree Failure',
  props<{ error: string | null | undefined }>()
);

export const clearTypeahead = createAction(
  '[Diseases/API] Clear Typeahead',
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
  props<{ error: string | null | undefined }>()
);

export const fetchDisease = createAction(
  '[Diseases/API] fetch Disease',
  props<{
    gardId: string,
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
  props<{ error: string | null | undefined }>()
);

export const fetchDiseaseList = createAction(
  '[Diseases/API] fetch Disease List',
  props<{
    gardIds: string[]
  }>()
);

export const fetchDiseaseListSuccess = createAction(
  '[Diseases/API] fetch Disease List Success',
  props<{ diseases: Disease[] }>()
);

export const fetchDiseaseListFailure = createAction(
  '[Diseases/API] fetch Disease List Failure',
  props<{ error: string | null | undefined }>()
);
