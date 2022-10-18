import { Disease } from "@ncats-frontend-library/models/rdas";
import { Action } from '@ngrx/store';

import * as DiseasesActions from './diseases.actions';
import { DiseasesEntity } from './diseases.models';
import {
  State,
  initialState,
  diseasesReducer,
} from './diseases.reducer';

describe('Diseases Reducer', () => {
  const createDiseasesEntity = (gard_id: string, name = ''): Disease => ({
    gard_id,
    name: name || `name-${gard_id}`,
    epiCount: 0,
    nonEpiCount: 0,
    projectCount: 0,
    clinicalTrialsCount: 0
  });

  describe('valid Diseases actions', () => {
    it('loadDiseasesSuccess should return the list of known Diseases', () => {
      const diseases = [
        createDiseasesEntity('PRODUCT-AAA'),
        createDiseasesEntity('PRODUCT-zzz'),
      ];
      const action = DiseasesActions.loadDiseasesSuccess({ diseases });

      const result: State = diseasesReducer(
        initialState,
        action
      );

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = diseasesReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
