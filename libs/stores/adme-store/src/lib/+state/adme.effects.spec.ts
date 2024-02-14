import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as AdmeActions from './adme.actions';
import { AdmeEffects } from './adme.effects';

describe('AdmeEffects', () => {
  let actions: Observable<Action>;
  let effects: AdmeEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AdmeEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(AdmeEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: AdmeActions.initAdme() });

      const expected = hot('-a-|', {
        a: AdmeActions.loadAdmeSuccess({ adme: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
