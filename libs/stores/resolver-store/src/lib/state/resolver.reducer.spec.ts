import { Action } from '@ngrx/store';

import * as ResolverActions from './resolver.actions';
import { ResolverEntity } from './resolver.models';
import {
  ResolverState,
  initialResolverState,
  resolverReducer,
} from './resolver.reducer';

describe('Resolver Reducer', () => {
  const createResolverEntity = (id: string, name = ''): ResolverEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid Resolver actions', () => {
    it('loadResolverSuccess should return the list of known Resolver', () => {
      const resolver = [
        createResolverEntity('PRODUCT-AAA'),
        createResolverEntity('PRODUCT-zzz'),
      ];
      const action = ResolverActions.loadResolverSuccess({ resolver });

      const result: ResolverState = resolverReducer(
        initialResolverState,
        action,
      );

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = resolverReducer(initialResolverState, action);

      expect(result).toBe(initialResolverState);
    });
  });
});
