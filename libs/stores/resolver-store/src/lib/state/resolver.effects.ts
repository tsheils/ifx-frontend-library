import { inject } from '@angular/core';
import { Filter } from "@ncats-frontend-library/models/utils";
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { ResolverForm, ResolverResponse } from "ifx";
import { catchError, of, exhaustMap, map } from "rxjs";
import { ResolverService } from "../resolver.service";
import { LoadResolverOptionsActions, ResolveQueryActions } from "./resolver.actions";
import * as ResolverActions from './resolver.actions';
import * as ResolverFeature from './resolver.reducer';




export const init$ = createEffect(
  (actions$ = inject(Actions), resolverService = inject(ResolverService)) => {
    return actions$.pipe(
      ofType(LoadResolverOptionsActions.loadResolverOptions),
      exhaustMap(() => {
        return resolverService.fetchOptions().pipe(
          map(
            (ret: { [key: string]: unknown }[]) => {
              const retArr: Filter[] = ret.map((opt: { [key: string]: unknown }) => {
                const tags: string[] = opt['tags'] as string[];
                opt['tags'] = tags.map(tag => tag
                  .replace('category', '')
                  .replace(/-/g, ' ')
                  .replace('URL', ' URL')
                  .trim()
                )
                return new Filter({...opt, value: <string>opt['name'], term: <string>opt['title']})
              }).sort((a,b) => a.term.localeCompare(b.term))
              return LoadResolverOptionsActions.loadResolverOptionsSuccess({ options: retArr });
            },
            catchError((error: ErrorEvent) =>
              of(LoadResolverOptionsActions.loadResolverOptionsFailure({ error: error.message })),
            ),
          ),
        );
      }),
    );
  },
  { functional: true },
);

export const resolveQuery = createEffect(
  (actions$ = inject(Actions), resolverService = inject(ResolverService)) => {
    return actions$.pipe(
      ofType(ResolveQueryActions.resolveQuery),
      exhaustMap((action:{urlStub: string, form: ResolverForm}) => {
        return resolverService.resolve(action.urlStub, action.form).pipe(
          map(
            (response: ResolverResponse[]) => {
              console.log(response)
              return ResolveQueryActions.resolveQuerySuccess({ data: response });
            },
            catchError((error: ErrorEvent) =>
              of(ResolveQueryActions.resolveQueryFailure({ error: error.message })),
            ),
          ),
        );
      }),
    );
  },
  { functional: true },
);
