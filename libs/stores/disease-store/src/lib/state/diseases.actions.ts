import { Disease, DiseaseNode, Gene, Phenotype } from "@ncats-frontend-library/models/rdas";
import { Page } from "@ncats-frontend-library/models/utils";
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

export const searchPhenotypes = createAction(
  '[Diseases/API] Search Phenotypes',
  props<{
    term: string
    skip?: number
    limit?: number
  }>()
);

export const searchPhenotypesSuccess = createAction(
  '[Diseases/API] Search Phenotypes Success',
  props<{ phenotypes: Phenotype[] }>()
);

export const searchPhenotypesFailure = createAction(
  '[Diseases/API] Search Phenotypes Failure',
  props<{ error: string | null | undefined }>()
);

export const fetchPhenotypes = createAction(
  '[Diseases/API] fetch Phenotypes',
  props<{
   skip?: number;
   limit?: number;
    term?: string
  }>()
);

export const fetchPhenotypesSuccess = createAction(
  '[Diseases/API] fetch Phenotypes Success',
  props<{ phenotypes: [{ term: string, count: number}] }>()
);

export const fetchPhenotypesFailure = createAction(
  '[Diseases/API] fetch Phenotypes Failure',
  props<{ error: string | null | undefined }>()
);

export const searchGenes = createAction(
  '[Diseases/API] Search Genes',
  props<{ term: string }>()
);

export const searchGenesSuccess = createAction(
  '[Diseases/API] Search Genes Success',
  props<{ typeahead: Gene[] }>()
);

export const searchGenesFailure = createAction(
  '[Diseases/API] Search Genes Failure',
  props<{ error: string | null | undefined }>()
);

export const fetchGene = createAction(
  '[Diseases/API] fetch Gene',
  props<{
    gardId: string,
    source: string,
    options?: { [key: string]: string }
  }>()
);

export const fetchGeneSuccess = createAction(
  '[Diseases/API] fetch Gene Success',
  props<{ gene: Gene }>()
);

export const fetchGeneFailure = createAction(
  '[Diseases/API] fetch Gene Failure',
  props<{ error: string | null | undefined }>()
);

