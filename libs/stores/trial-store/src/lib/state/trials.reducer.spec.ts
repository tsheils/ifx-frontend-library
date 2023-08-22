import { Action } from '@ngrx/store';

import * as TrialsActions from './trials.actions';
import { TrialsEntity } from './trials.models';
import {
  TrialsState,
  initialTrialsState,
  trialsReducer,
} from './trials.reducer';

describe('Trials Reducer', () => {
  const createTrialsEntity = (id: string, name = ''): TrialsEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid Trials actions', () => {
    it('loadTrialsSuccess should return the list of known Trials', () => {
      const trials = [
        createTrialsEntity('PRODUCT-AAA'),
        createTrialsEntity('PRODUCT-zzz'),
      ];
      const action = TrialsActions.loadTrialsSuccess({ trials });

      const result: TrialsState = trialsReducer(initialTrialsState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
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
