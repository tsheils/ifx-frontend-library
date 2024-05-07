import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as RampActions from './ramp.actions';
import { RampEffects } from './ramp.effects';

describe('RampEffects', () => {
  let actions: Observable<Action>;
  let effects: RampEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        RampEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(RampEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: RampActions.initRamp() });

      const expected = hot('-a-|', {
        a: RampActions.loadRampSuccess({ ramp: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
