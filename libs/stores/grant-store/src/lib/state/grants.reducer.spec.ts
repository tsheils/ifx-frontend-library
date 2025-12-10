import { CoreProject } from 'rdas-models';
import { Action } from '@ngrx/store';
import { FetchProjectsListActions } from './grants.actions';

import {
  ProjectsState,
  initialProjectsState,
  projectsReducer,
} from './grants.reducer';

describe('Grants Reducer', () => {
  const createGrantsEntity = (id: string) =>
    new CoreProject({
      core_project_num: id,
    });

  describe('valid Grants actions', () => {
    it('FetchGrantsListSuccess should return the list of known Grants', () => {
      const grants = [
        createGrantsEntity('PRODUCT-AAA'),
        createGrantsEntity('PRODUCT-zzz'),
      ];
      const action = FetchProjectsListActions.fetchProjectsListSuccess({
        projects: grants,
        projectsCount: 2,
        allProjectsCount: 2,
      });

      const result: ProjectsState = projectsReducer(
        initialProjectsState,
        action
      );

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = projectsReducer(initialProjectsState, action);

      expect(result).toBe(initialProjectsState);
    });
  });
});
