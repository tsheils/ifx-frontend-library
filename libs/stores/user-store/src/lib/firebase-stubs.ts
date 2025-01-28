import { BehaviorSubject } from 'rxjs'

export const COMMON_CONFIG = {
  apiKey: 'AIzaSyAeMmLhQqFbvzlP9kQfpCAteynu8Boo4qs',
  authDomain: 'ncats-summer-interns.firebaseapp.com',
  databaseURL: 'https://ncats-summer-interns.firebaseio.com',
  projectId: 'ncats-summer-interns',
  storageBucket: 'ncats-summer-interns.appspot.com',
  messagingSenderId: '528718212509',
  appId: '1:528718212509:web:028a64c1993f8441f81374',
}

export const FIRESTORESTUB = {
  collection: () => ({
    doc: () => ({
      valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
      set: () => new Promise((resolve) => resolve('Hi Keith')),
      get: () => new Promise((resolve) => resolve('Hi Keith')),
    }),
    valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
  }),
  valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
}
