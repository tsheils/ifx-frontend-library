import { Action } from '@ngrx/store';

import * as AdmeActions from './adme.actions';
import { AdmeEntity } from './adme.models';
import { AdmeState, initialAdmeState, admeReducer } from './adme.reducer';

describe('Adme Reducer', () => {
  const createAdmeEntity = (id: string, name = ''): AdmeEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid Adme actions', () => {
    it('loadAdmeSuccess should return the list of known Adme', () => {
      const adme = [
        createAdmeEntity('PRODUCT-AAA'),
        createAdmeEntity('PRODUCT-zzz'),
      ];
      const action = AdmeActions.loadAdmeSuccess({ adme });

      const result: AdmeState = admeReducer(initialAdmeState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = admeReducer(initialAdmeState, action);

      expect(result).toBe(initialAdmeState);
    });
  });
});
