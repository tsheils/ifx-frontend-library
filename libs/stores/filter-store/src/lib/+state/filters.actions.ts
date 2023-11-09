import { Filter, FilterCategory } from '@ncats-frontend-library/models/utils';
import { createAction, props } from '@ngrx/store';

export const searchFilters = createAction(
  '[Filters/API] Search Filters',
  props<{
    term: string;
    skip?: number;
    limit?: number;
  }>()
);

export const searchFiltersSuccess = createAction(
  '[Filters/API] Search Filters Success',
  props<{ filters: Filter[] }>()
);

export const searchFiltersFailure = createAction(
  '[Filters/API] Search Filters Failure',
  props<{ error: string | null | undefined }>()
);

export const fetchFilters = createAction(
  '[Filters/API] fetch Filters',
  props<{
    label: string;
    skip?: number;
    limit?: number;
    term?: string;
    terms?: string[];
  }>()
);

export const fetchFiltersSuccess = createAction(
  '[Filters/API] fetch Filters Success',
  props<{ filters: FilterCategory[] }>()
);

export const fetchFiltersFailure = createAction(
  '[Filters/API] fetch Filters Failure',
  props<{ error: string | null | undefined }>()
);
