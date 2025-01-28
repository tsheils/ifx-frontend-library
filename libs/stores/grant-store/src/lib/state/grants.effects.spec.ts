import { TestBed } from '@angular/core/testing'
import { CoreProject } from '@ncats-frontend-library/models/rdas';
import { provideMockActions } from '@ngrx/effects/testing'
import { Action } from '@ngrx/store'
import { provideMockStore } from '@ngrx/store/testing'
import { hot } from 'jasmine-marbles'
import { Observable } from 'rxjs'
import { FetchProjectsListActions } from './grants.actions'
import * as GrantsEffects from './grants.effects'

describe('GrantsEffects', () => {
  let actions: Observable<Action>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        GrantsEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    })
  })

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', {
        a: FetchProjectsListActions.fetchProjectsList({ top: 0, skip: 0 }),
      })

      const expected = hot('-a-|', {
        a: FetchProjectsListActions.fetchProjectsListSuccess({ projects: [] as CoreProject[],  projectsCount: 666,   allProjectsCount: 666 }),
      })

      expect([]).toEqual([])
    })
  })
})
