import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { BehaviorSubject } from "rxjs";

import { UserService } from './user.service';

export const COMMON_CONFIG = {
  apiKey: "AIzaSyAeMmLhQqFbvzlP9kQfpCAteynu8Boo4qs",
  authDomain: "ncats-summer-interns.firebaseapp.com",
  databaseURL: "https://ncats-summer-interns.firebaseio.com",
  projectId: "ncats-summer-interns",
  storageBucket: "ncats-summer-interns.appspot.com",
  messagingSenderId: "528718212509",
  appId: "1:528718212509:web:028a64c1993f8441f81374"
};

export const FIRESTORESTUB = {
  collection: (name: string) => ({
    doc: (_id: string) => ({
      valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
      set: (_d: any) => new Promise((resolve, _reject) => resolve('Hi Keith')),
      get: (_d: any) => new Promise((resolve, _reject) => resolve('Hi Keith')),
    }),
    valueChanges: () => new BehaviorSubject({ foo: 'bar' })
  }),
  valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [
        AngularFireModule.initializeApp(COMMON_CONFIG)
        ],
        providers: [
          { provide: AngularFirestore, useValue: FIRESTORESTUB },
        ]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
