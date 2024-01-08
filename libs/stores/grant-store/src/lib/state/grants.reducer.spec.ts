import { Action } from '@ngrx/store';

import * as GrantsActions from './grants.actions';
import { GrantsEntity } from './grants.models';
import {
  GrantsState,
  initialGrantsState,
  grantsReducer,
} from './grants.reducer';

describe('Grants Reducer', () => {
  const createGrantsEntity = (id: string, name = ''): GrantsEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid Grants actions', () => {
    it('loadGrantsSuccess should return the list of known Grants', () => {
      const grants = [
        createGrantsEntity('PRODUCT-AAA'),
        createGrantsEntity('PRODUCT-zzz'),
      ];
      const action = GrantsActions.loadGrantsSuccess({ grants });

      const result: GrantsState = grantsReducer(initialGrantsState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = grantsReducer(initialGrantsState, action);

      expect(result).toBe(initialGrantsState);
    });
  });
});
