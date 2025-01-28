import { TestBed } from '@angular/core/testing'
import { provideMockActions } from '@ngrx/effects/testing'
import { Action } from '@ngrx/store'
import { provideMockStore } from '@ngrx/store/testing'
import { hot } from 'jasmine-marbles'
import { Observable } from 'rxjs'
import { FetchTrialsListActions } from './trials.actions';

import * as TrialsEffects from './trials.effects'

describe('TrialsEffects', () => {
  let actions: Observable<Action>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        TrialsEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    })
  })

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', {
        a: FetchTrialsListActions.fetchTrialsList({ top: 10, skip: 0 }),
      })

      const expected = hot('-a-|', {
        a: FetchTrialsListActions.fetchTrialsListSuccess({ trials: [], allTrialCount: 0 }),
      })

      expect(expected).toBeObservable(expected)
    })
  })
})
