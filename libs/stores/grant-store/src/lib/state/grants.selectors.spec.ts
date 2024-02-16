import { CoreProject } from "@ncats-frontend-library/models/rdas";
import {
  grantsAdapter,
  GrantsPartialState,
  initialGrantsState,
} from './grants.reducer';
import * as GrantsSelectors from './grants.selectors';

describe('Grants Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getGrantsId = (it: CoreProject) => it.core_project_num;
  const createGrantsEntity = (id: string, name = '') =>
   new CoreProject({
      core_project_num: id,
    });

  let state: GrantsPartialState;

  beforeEach(() => {
    state = {
      grants: grantsAdapter.setAll(
        [
          createGrantsEntity('PRODUCT-AAA'),
          createGrantsEntity('PRODUCT-BBB'),
          createGrantsEntity('PRODUCT-CCC'),
        ],
        {
          ...initialGrantsState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('Grants Selectors', () => {
    it('selectAllGrants() should return the list of Grants', () => {
      const results = GrantsSelectors.selectAllGrants(state);
      const selId = getGrantsId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = GrantsSelectors.selectEntity(state);
      let selId
      if(result) {
        selId = getGrantsId(result);
      } else {
        selId = undefined
      }

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectGrantsLoaded() should return the current "loaded" status', () => {
      const result = GrantsSelectors.selectGrantsLoaded(state);

      expect(result).toBe(true);
    });

    it('selectGrantsError() should return the current "error" state', () => {
      const result = GrantsSelectors.selectGrantsError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
