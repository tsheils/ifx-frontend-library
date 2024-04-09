import { IfxToolsEntity } from './ifx-tools.models';
import {
  ifxToolsAdapter,
  IfxToolsPartialState,
  initialIfxToolsState,
} from './ifx-tools.reducer';
import * as IfxToolsSelectors from './ifx-tools.selectors';

describe('IfxTools Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getIfxToolsId = (it: IfxToolsEntity) => it.id;
  const createIfxToolsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    }) as IfxToolsEntity;

  let state: IfxToolsPartialState;

  beforeEach(() => {
    state = {
      ifxTools: ifxToolsAdapter.setAll(
        [
          createIfxToolsEntity('PRODUCT-AAA'),
          createIfxToolsEntity('PRODUCT-BBB'),
          createIfxToolsEntity('PRODUCT-CCC'),
        ],
        {
          ...initialIfxToolsState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        },
      ),
    };
  });

  describe('IfxTools Selectors', () => {
    it('selectAllIfxTools() should return the list of IfxTools', () => {
      const results = IfxToolsSelectors.selectAllIfxTools(state);
      const selId = getIfxToolsId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = IfxToolsSelectors.selectEntity(state) as IfxToolsEntity;
      const selId = getIfxToolsId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectIfxToolsLoaded() should return the current "loaded" status', () => {
      const result = IfxToolsSelectors.selectIfxToolsLoaded(state);

      expect(result).toBe(true);
    });

    it('selectIfxToolsError() should return the current "error" state', () => {
      const result = IfxToolsSelectors.selectIfxToolsError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
