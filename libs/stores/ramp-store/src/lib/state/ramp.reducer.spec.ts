import { Action } from '@ngrx/store';

import * as RampActions from './ramp.actions';
import { RampEntity } from './ramp.models';
import { RampState, initialRampState, rampReducer } from './ramp.reducer';

describe('Ramp Reducer', () => {
  const createRampEntity = (id: string, name = ''): RampEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid Ramp actions', () => {
    it('loadRampSuccess should return the list of known Ramp', () => {
      const ramp = [
        createRampEntity('PRODUCT-AAA'),
        createRampEntity('PRODUCT-zzz'),
      ];
      const action = RampActions.loadRampSuccess({ ramp });

      const result: RampState = rampReducer(initialRampState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = rampReducer(initialRampState, action);

      expect(result).toBe(initialRampState);
    });
  });
});
