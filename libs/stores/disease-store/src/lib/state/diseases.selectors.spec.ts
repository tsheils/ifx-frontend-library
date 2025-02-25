import { Disease } from '@ncats-frontend-library/models/rdas';
import { DISEASESTATEMOCK } from '../../test-setup';
import { State } from './diseases.reducer';
import * as DiseasesSelectors from './diseases.selectors';

describe('Diseases Selectors', () => {
  const ERROR_MSG = 'No Error Available';

  let state: State;

  beforeEach(() => {
    state = DISEASESTATEMOCK as unknown as State;
  });

  describe('Diseases Selectors', () => {
    it('getAllDiseases() should return the list of Diseases', () => {
      const results = DiseasesSelectors.getAllDiseases(state);
      const selId = results[0].gardId;

      expect(results.length).toBe(10);
      expect(selId).toBe('GARD:0017280');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = DiseasesSelectors.getSelected(state) as Disease;
      const selId = result.gardId;
      expect(selId).toBe('GARD:0017280');
    });

    it('getDiseasesLoaded() should return the current "loaded" status', () => {
      const result = DiseasesSelectors.getDiseasesLoaded(state);

      expect(result).toBe(true);
    });

    it('getDiseasesError() should return the current "error" state', () => {
      const result = DiseasesSelectors.getDiseasesError(state);
      expect(result).toBe(ERROR_MSG);
    });
  });
});
