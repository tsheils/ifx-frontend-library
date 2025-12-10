import { ClinicalTrial } from 'rdas-models';
import {
  trialsAdapter,
  TrialsPartialState,
  initialTrialsState,
} from './trials.reducer';
import * as TrialsSelectors from './trials.selectors';

describe('Trials Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getTrialsId = (it: ClinicalTrial) => it['NCTId'];
  const createTrialsEntity = (NCTId: string, briefTitle = '') =>
    ({
      NCTId,
      briefTitle: briefTitle || `name-${NCTId}`,
    } as ClinicalTrial);

  let state: TrialsPartialState;

  beforeEach(() => {
    state = {
      trials: trialsAdapter.setAll(
        [
          createTrialsEntity('PRODUCT-AAA'),
          createTrialsEntity('PRODUCT-BBB'),
          createTrialsEntity('PRODUCT-CCC'),
        ],
        {
          ...initialTrialsState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('Trials Selectors', () => {
    it('selectAllTrials() should return the list of Trials', () => {
      const results = TrialsSelectors.selectAllTrials(state);
      const selId = getTrialsId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = TrialsSelectors.selectEntity(state);
      let selId;
      if (result) {
        selId = getTrialsId(result);
      } else {
        selId = undefined;
      }

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectTrialsLoaded() should return the current "loaded" status', () => {
      const result = TrialsSelectors.selectTrialsLoaded(state);

      expect(result).toBe(true);
    });

    it('selectTrialsError() should return the current "error" state', () => {
      const result = TrialsSelectors.selectTrialsError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
