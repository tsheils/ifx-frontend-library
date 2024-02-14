import { AdmeEntity } from './adme.models';
import {
  admeAdapter,
  AdmePartialState,
  initialAdmeState,
} from './adme.reducer';
import * as AdmeSelectors from './adme.selectors';

describe('Adme Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getAdmeId = (it: AdmeEntity) => it.id;
  const createAdmeEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    }) as AdmeEntity;

  let state: AdmePartialState;

  beforeEach(() => {
    state = {
      adme: admeAdapter.setAll(
        [
          createAdmeEntity('PRODUCT-AAA'),
          createAdmeEntity('PRODUCT-BBB'),
          createAdmeEntity('PRODUCT-CCC'),
        ],
        {
          ...initialAdmeState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        },
      ),
    };
  });

  describe('Adme Selectors', () => {
    it('selectAllAdme() should return the list of Adme', () => {
      const results = AdmeSelectors.selectAllAdme(state);
      const selId = getAdmeId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = AdmeSelectors.selectEntity(state) as AdmeEntity;
      const selId = getAdmeId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectAdmeLoaded() should return the current "loaded" status', () => {
      const result = AdmeSelectors.selectAdmeLoaded(state);

      expect(result).toBe(true);
    });

    it('selectAdmeError() should return the current "error" state', () => {
      const result = AdmeSelectors.selectAdmeError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
