import { Action } from '@ngrx/store';
import { Tool } from "ifx";
import { TOOLSTATE } from "../../test-setup";
import { LoadToolsActions } from "./ifx-tools.actions";

import {
  IfxToolsState,
  initialIfxToolsState,
  ifxToolsReducer,
} from './ifx-tools.reducer';

describe('IfxTools Reducer', () => {

  describe('valid IfxTools actions', () => {
    it('loadIfxToolsSuccess should return the list of known IfxTools', () => {

      const action = LoadToolsActions.loadToolsSuccess({
        audienceList: TOOLSTATE.ifxTools.audienceList,
        categoryList: TOOLSTATE.ifxTools.categoryList,
        tools: [...Object.values(TOOLSTATE.ifxTools.entities)] as Tool[]
      });

      const result: IfxToolsState = ifxToolsReducer(
        initialIfxToolsState,
        action,
      );

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(31);
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
