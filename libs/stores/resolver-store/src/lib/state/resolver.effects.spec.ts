import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as ResolverActions from './resolver.actions';
import { ResolverEffects } from './resolver.effects';

describe('ResolverEffects', () => {
  let actions: Observable<Action>;
  let effects: ResolverEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ResolverEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(ResolverEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: ResolverActions.initResolver() });

      const expected = hot('-a-|', {
        a: ResolverActions.loadResolverSuccess({ resolver: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
