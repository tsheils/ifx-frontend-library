import { Article } from 'rdas-models';
import {
  Filter,
  FilterCategory,
  Page,
} from 'utils-models';
import { createAction, createActionGroup, props } from '@ngrx/store';

export const SearchFiltersActions = createActionGroup({
  source: 'Search Filters',
  events: {
    searchFilters: props<{
      term: string;
      skip?: number;
      limit?: number;
    }>(),
    searchFiltersSuccess: props<{ filters: Filter[] }>(),
    searchFiltersFailure: props<{ error: string }>(),
  },
});

export const FetchFiltersActions = createActionGroup({
  source: 'Fetch Filters',
  events: {
    fetchFilters: props<{
      label: string;
      skip?: number;
      limit?: number;
      term?: string;
      terms?: string[];
    }>(),
    fetchFiltersSuccess: props<{ filters: FilterCategory[] }>(),
    fetchFiltersFailure: props<{ error: string }>(),
  },
});
