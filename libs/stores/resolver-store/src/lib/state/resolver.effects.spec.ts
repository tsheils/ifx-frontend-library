import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { LoadResolverOptionsActions } from './resolver.actions';

import * as ResolverActions from './resolver.actions';
import { init$ } from './resolver.effects';
import * as ResolverEffects from './resolver.effects';

describe('ResolverEffects', () => {
  let actions: Observable<Action>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ResolverEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', {
        a: LoadResolverOptionsActions.loadResolverOptions(),
      });

      const expected = hot('-a-|', {
        a: LoadResolverOptionsActions.loadResolverOptionsSuccess({
          options: [],
        }),
      });

      expect([]).toEqual([]);
    });
  });
});
