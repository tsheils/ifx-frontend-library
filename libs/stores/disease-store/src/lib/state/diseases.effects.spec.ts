import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { NxModule } from '@nrwl/angular';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as DiseasesActions from './diseases.actions';
import { DiseasesEffects } from './diseases.effects';

describe('DiseasesEffects', () => {
  let actions: Observable<Action>;
  let effects: DiseasesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        DiseasesEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(DiseasesEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: DiseasesActions.initDiseases() });

      const expected = hot('-a-|', {
        a: DiseasesActions.loadDiseasesSuccess({ diseases: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
