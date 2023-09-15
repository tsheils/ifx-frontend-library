import { createAction, props } from '@ngrx/store';
import { FiltersEntity } from './filters.models';

export const initFilters = createAction('[Filters Page] Init');

export const loadFiltersSuccess = createAction(
  '[Filters/API] Load Filters Success',
  props<{ filters: FiltersEntity[] }>()
);

export const loadFiltersFailure = createAction(
  '[Filters/API] Load Filters Failure',
  props<{ error: any }>()
);
