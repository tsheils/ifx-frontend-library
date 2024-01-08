import { Disease } from '@ncats-frontend-library/models/rdas';
import { diseasesAdapter, State, initialState } from './diseases.reducer';
import * as DiseasesSelectors from './diseases.selectors';

describe('Diseases Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getDiseasesId = (it: Disease) => it.gardId;
  const createDiseasesEntity = (gardId: string, name = ''): Disease => ({
    gardId: gardId,
    name: name || `name-${gardId}`,
    epiCount: 0,
    nonEpiCount: 0,
    projectCount: 0,
    clinicalTrialsCount: 0,
  });

  let state: State;

  const diseasesArr = [
    createDiseasesEntity('PRODUCT-AAA'),
    createDiseasesEntity('PRODUCT-BBB'),
    createDiseasesEntity('PRODUCT-CCC'),
  ];

  beforeEach(() => {
    state = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      diseases: diseasesAdapter.setAll(diseasesArr, {
        ...initialState,
        selectedId: 'PRODUCT-BBB',
        error: ERROR_MSG,
        loaded: true,
        typeahead: undefined,
      }),
    };
  });

  describe('Diseases Selectors', () => {
    it('getAllDiseases() should return the list of Diseases', () => {
      const results = DiseasesSelectors.getAllDiseases(state);
      const selId = getDiseasesId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = DiseasesSelectors.getSelected(state) as Disease;
      const selId = getDiseasesId(result);

      expect(selId).toBe('PRODUCT-BBB');
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
