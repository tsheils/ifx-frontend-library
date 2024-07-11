import { Action } from '@ngrx/store';
import { LoadTrialsActions } from './trials.actions';

import * as TrialsActions from './trials.actions';
import {
  TrialsState,
  initialTrialsState,
  trialsReducer,
} from './trials.reducer';

describe('Trials Reducer', () => {
  describe('valid Trials actions', () => {
    it('loadTrialsSuccess should return the list of known Trials', () => {
      const action = LoadTrialsActions.loadTrialsSuccess({ trials: [] });

      const result: TrialsState = trialsReducer(initialTrialsState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(0);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = trialsReducer(initialTrialsState, action);

      expect(result).toBe(initialTrialsState);
    });
  });
});
