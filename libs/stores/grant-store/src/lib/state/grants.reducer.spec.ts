import { CoreProject } from '@ncats-frontend-library/models/rdas';
import { Action } from '@ngrx/store';
import { LoadGrantsActions } from './grants.actions';

import {
  GrantsState,
  initialGrantsState,
  grantsReducer,
} from './grants.reducer';

describe('Grants Reducer', () => {
  const createGrantsEntity = (id: string) =>
    new CoreProject({
      core_project_num: id,
    });

  describe('valid Grants actions', () => {
    it('loadGrantsSuccess should return the list of known Grants', () => {
      const grants = [
        createGrantsEntity('PRODUCT-AAA'),
        createGrantsEntity('PRODUCT-zzz'),
      ];
      const action = LoadGrantsActions.loadGrantsSuccess({ grants });

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
