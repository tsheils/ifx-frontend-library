import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as IfxToolsActions from './ifx-tools.actions';
import { IfxToolsEffects } from './ifx-tools.effects';

describe('IfxToolsEffects', () => {
  let actions: Observable<Action>;
  let effects: IfxToolsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        IfxToolsEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(IfxToolsEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: IfxToolsActions.initIfxTools() });

      const expected = hot('-a-|', {
        a: IfxToolsActions.loadIfxToolsSuccess({ ifxTools: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
