import { Filter } from '@ncats-frontend-library/models/utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ResolverForm, ResolverResponse } from 'ifx';

export const LoadResolverOptionsActions = createActionGroup({
  source: 'Load Resolver Options',
  events: {
    setPreviousFilters: props<{ filters: string[] }>(),
    loadResolverOptions: emptyProps(),
    loadResolverOptionsSuccess: props<{ options: Filter[] }>(),
    loadResolverOptionsFailure: props<{ error: string }>(),
  },
});

export const ResolveQueryActions = createActionGroup({
  source: 'Resolve Query',
  events: {
    resolveQuery: props<{ urlStub: string; form: ResolverForm }>(),
    resolveQuerySuccess: props<{ data: ResolverResponse[] }>(),
    resolveQueryFailure: props<{ error: string }>(),
  },
});
