import { RampEntity } from './ramp.models';
import {
  rampAdapter,
  RampPartialState,
  initialRampState,
} from './ramp.reducer';
import * as RampSelectors from './ramp.selectors';

describe('Ramp Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getRampId = (it: RampEntity) => it.id;
  const createRampEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    }) as RampEntity;

  let state: RampPartialState;

  beforeEach(() => {
    state = {
      ramp: rampAdapter.setAll(
        [
          createRampEntity('PRODUCT-AAA'),
          createRampEntity('PRODUCT-BBB'),
          createRampEntity('PRODUCT-CCC'),
        ],
        {
          ...initialRampState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        },
      ),
    };
  });

  describe('Ramp Selectors', () => {
    it('selectAllRamp() should return the list of Ramp', () => {
      const results = RampSelectors.selectAllRamp(state);
      const selId = getRampId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = RampSelectors.selectEntity(state) as RampEntity;
      const selId = getRampId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectRampLoaded() should return the current "loaded" status', () => {
      const result = RampSelectors.selectRampLoaded(state);

      expect(result).toBe(true);
    });

    it('selectRampError() should return the current "error" state', () => {
      const result = RampSelectors.selectRampError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
