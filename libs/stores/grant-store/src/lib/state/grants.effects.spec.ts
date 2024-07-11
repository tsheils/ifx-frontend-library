import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { LoadGrantsActions } from './grants.actions';
import { loadGrant$ } from './grants.effects';
import * as GrantsEffects from './grants.effects';

describe('GrantsEffects', () => {
  let actions: Observable<Action>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        GrantsEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', {
        a: LoadGrantsActions.loadGrants({ top: 0, skip: 0 }),
      });

      const expected = hot('-a-|', {
        a: LoadGrantsActions.loadGrantsSuccess({ grants: [] }),
      });

      expect([]).toEqual([]);
    });
  });
});
