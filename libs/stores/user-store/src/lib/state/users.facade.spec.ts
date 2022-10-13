import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { User } from "@ncats-frontend-library/models/utils";
import environment from "@neo4j/graphql/dist/environment";
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { NxModule } from '@nrwl/angular';
import { readFirst } from '@nrwl/angular/testing';
import { BehaviorSubject } from "rxjs";

import * as UsersActions from './users.actions';
import { UsersEffects } from './users.effects';
import { UsersFacade } from './users.facade';
import {
  reducer,
  State,
  USERS_FEATURE_KEY
} from "./users.reducer";

interface TestSchema {
  users: State;
}

export const COMMON_CONFIG = {
  projectId: 'pharos',
  apiKey: 'AIzaSyBVSy3YpkVGiKXbbxeK0qBnu3-MNZ9UIjA',
  authDomain: 'angularfire2-test.firebaseapp.com',
  databaseURL: 'https://angularfire2-test.firebaseio.com',
  storageBucket: 'angularfire2-test.appspot.com',
};


export const FIRESTORESTUB = {
  collection: (name: string) => ({
    doc: (_id: string) => ({
      valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
      set: (_d: any) => new Promise((resolve, _reject) => resolve('Hi Keith')),
    }),
    valueChanges: () => new BehaviorSubject({ foo: 'bar' })
  }),
  valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
};



describe('UsersFacade', () => {
  let facade: UsersFacade;
  let store: Store<TestSchema>;
  const createUsersEntity = (uid: string, displayName = ''): User => ({
    uid,
    displayName: displayName || `name-${uid}`,
    subscriptions: []
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(USERS_FEATURE_KEY, reducer),
          EffectsModule.forFeature([UsersEffects]),
          AngularFireModule.initializeApp(COMMON_CONFIG)
        ],
        providers: [UsersFacade],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          NxModule.forRoot(),
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule,
          { provide: AngularFirestore, useValue: FIRESTORESTUB }
        ],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.inject(Store);
      facade = TestBed.inject(UsersFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let list = await readFirst(facade.user$);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      list = await readFirst(facade.user$);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadUsersSuccess` to manually update list
     */
    it('allUsers$ should return the loaded list; and loaded flag == true', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let list = await readFirst(facade.user$);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        UsersActions.loginUserSuccess({
          user: createUsersEntity('AAA'),
        })
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      list = await readFirst(facade.user$);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(1);
      expect(isLoaded).toBe(true);
    });
  });
});
