import { CoreProject } from '@ncats-frontend-library/models/rdas'
import {
  initialProjectsState,
  projectsAdapter,
  ProjectsPartialState

} from './grants.reducer';
import * as ProjectSelectors from './grants.selectors'

describe('Grants Selectors', () => {
  const ERROR_MSG = 'No Error Available'
  const getGrantsId = (it: CoreProject) => it.core_project_num
  const createGrantsEntity = (id: string, name = '') =>
    new CoreProject({
      core_project_num: id,
    })

  let state: ProjectsPartialState

  beforeEach(() => {
    state = {
      projects: projectsAdapter.setAll(
        [
          createGrantsEntity('PRODUCT-AAA'),
          createGrantsEntity('PRODUCT-BBB'),
          createGrantsEntity('PRODUCT-CCC'),
        ],
        {
          ...initialProjectsState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    }
  })

  describe('Grants Selectors', () => {
    it('selectAllGrants() should return the list of Grants', () => {
      const results = ProjectSelectors.selectAllProjects(state)
      const selId = getGrantsId(results[1])

      expect(results.length).toBe(3)
      expect(selId).toBe('PRODUCT-BBB')
    })

    it('selectEntity() should return the selected Entity', () => {
      const result = ProjectSelectors.selectEntity(state)
      let selId
      if (result) {
        selId = getGrantsId(result)
      } else {
        selId = undefined
      }

      expect(selId).toBe('PRODUCT-BBB')
    })

    it('selectGrantsLoaded() should return the current "loaded" status', () => {
      const result = ProjectSelectors.selectProjectsLoaded(state)

      expect(result).toBe(true)
    })

    it('selectGrantsError() should return the current "error" state', () => {
      const result = ProjectSelectors.selectProjectsError(state)

      expect(result).toBe(ERROR_MSG)
    })
  })
})
