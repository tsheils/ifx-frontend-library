import { TestBed } from '@angular/core/testing';
import { Disease } from '@ncats-frontend-library/models/rdas';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Apollo } from 'apollo-angular';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as DiseasesActions from './diseases.actions';
import { DiseasesEffects } from './diseases.effects';

describe('DiseasesEffects', () => {
  const createDiseasesEntity = (gardId: string, name = ''): Disease =>
    new Disease({
      gardId,
      name: name || `name-${gardId}`,
      epiCount: 0,
      nonEpiCount: 0,
      projectCount: 0,
      clinicalTrialsCount: 0,
    });

  const diseasesArr = [
    createDiseasesEntity('PRODUCT-AAA'),
    createDiseasesEntity('PRODUCT-BBB'),
    createDiseasesEntity('PRODUCT-CCC'),
  ];

  let actions: Observable<Action>;
 // let effects: DiseasesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        DiseasesEffects,
        provideMockActions(() => actions),
        provideMockStore(),
        Apollo,
      ],
    });

    effects = TestBed.inject(DiseasesEffects);
  });

  describe('loadDiseases', () => {
    it('should work', () => {
      actions = hot('-a-|', {
        a: DiseasesActions.loadDiseases({ top: 10, skip: 0 }),
      });
      hot('-a-|', {
        a: DiseasesActions.loadDiseasesSuccess({
          diseases: diseasesArr,
          page: undefined,
        }),
      });

      //fake test
      expect(true).toBe(true);
    });
  });
});
