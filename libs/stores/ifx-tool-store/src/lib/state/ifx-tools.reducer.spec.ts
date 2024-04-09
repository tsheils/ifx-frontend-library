import { Action } from '@ngrx/store';

import * as IfxToolsActions from './ifx-tools.actions';
import {
  IfxToolsState,
  initialIfxToolsState,
  ifxToolsReducer,
} from './ifx-tools.reducer';

describe('IfxTools Reducer', () => {
  const createIfxToolsEntity = (id: string, name = ''): IfxToolsEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid IfxTools actions', () => {
    it('loadIfxToolsSuccess should return the list of known IfxTools', () => {
      const ifxTools = [
        createIfxToolsEntity('PRODUCT-AAA'),
        createIfxToolsEntity('PRODUCT-zzz'),
      ];
      const action = IfxToolsActions.loadIfxToolsSuccess({ ifxTools });

      const result: IfxToolsState = ifxToolsReducer(
        initialIfxToolsState,
        action,
      );

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = ifxToolsReducer(initialIfxToolsState, action);

      expect(result).toBe(initialIfxToolsState);
    });
  });
});
