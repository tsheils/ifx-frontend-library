import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as TrialsActions from './trials.actions';
import { TrialsEffects } from './trials.effects';

describe('TrialsEffects', () => {
  let actions: Observable<Action>;
  let effects: TrialsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        TrialsEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(TrialsEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: TrialsActions.initTrials() });

      const expected = hot('-a-|', {
        a: TrialsActions.loadTrialsSuccess({ trials: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
