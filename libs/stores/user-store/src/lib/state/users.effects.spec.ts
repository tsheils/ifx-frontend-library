import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { User } from "@ncats-frontend-library/models/utils";
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from "@ngrx/store";
import { provideMockStore } from '@ngrx/store/testing';
import { NxModule } from '@nrwl/angular';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { COMMON_CONFIG, FIRESTORESTUB } from "../user.service.spec";

import * as UsersActions from './users.actions';
import { UsersEffects } from './users.effects';

describe('UsersEffects', () => {
  let actions: Observable<Action>;
  let effects: UsersEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
      AngularFireModule.initializeApp(COMMON_CONFIG)
      ],
      providers: [
        UsersEffects,
        provideMockActions(() => actions),
        provideMockStore(),
        { provide: AngularFirestore, useValue: FIRESTORESTUB }
      ],
    });

    effects = TestBed.inject(UsersEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: UsersActions.init() });

      const expected = hot('-a-|', {
        a: UsersActions.loginUserFailure({error: "oops"}),
      });

      expect(effects.init).toBeObservable(expected);
    });
  });
});
