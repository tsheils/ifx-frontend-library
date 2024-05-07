import { TestBed } from '@angular/core/testing';
import { Auth } from "@angular/fire/auth";
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { COMMON_CONFIG, FIRESTORESTUB } from '../firebase-stubs';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { RdasUsersInitActions } from "./users.actions";
import * as UsersEffects  from './users.effects';

describe('UsersEffects', () => {
  let actions: Observable<Action>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AngularFireModule.initializeApp(COMMON_CONFIG)],
      providers: [
        UsersEffects,
        provideMockActions(() => actions),
        provideMockStore(),
        { provide: AngularFirestore, useValue: FIRESTORESTUB },
        { provide: Auth, useValue: {  } }
      ],
    });

  //  effects = TestBed.inject(UsersEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: RdasUsersInitActions.init() });

      const expected = hot('-a-|', {
        a: RdasUsersInitActions.initFailure({ error: '' }),
      });

      expect(expected).toBeObservable(expected);
    });
  });
});
