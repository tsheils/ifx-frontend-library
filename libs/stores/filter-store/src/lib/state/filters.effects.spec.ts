import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as FiltersActions from './filters.actions';
import { FiltersEffects } from './filters.effects';

describe('FiltersEffects', () => {
  let actions: Observable<Action>;
  let effects: FiltersEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        FiltersEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(FiltersEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: FiltersActions.initFilters() });

      const expected = hot('-a-|', {
        a: FiltersActions.loadFiltersSuccess({ filters: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
