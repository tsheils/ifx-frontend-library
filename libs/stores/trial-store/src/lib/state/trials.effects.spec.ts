import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { LoadTrialsActions } from "./trials.actions";

import * as TrialsEffects from './trials.effects';
import * as TrialsActions from './trials.actions';

describe('TrialsEffects', () => {
  let actions: Observable<Action>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        TrialsEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: LoadTrialsActions.loadTrials({top:10, skip: 0}) });

      const expected = hot('-a-|', {
        a: LoadTrialsActions.loadTrialsSuccess({ trials: [] }),
      });

      expect(expected).toBeObservable(expected);
    });
  });
});
