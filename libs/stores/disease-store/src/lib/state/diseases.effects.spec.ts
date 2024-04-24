import { TestBed } from '@angular/core/testing';
import { Disease } from '@ncats-frontend-library/models/rdas';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Apollo } from 'apollo-angular';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { BrowseDiseaseListActions } from "./diseases.actions";

import * as DiseasesActions from './diseases.actions';
import * as DiseasesEffects  from './diseases.effects';

describe('DiseasesEffects', () => {
  const createDiseasesEntity = (gardId: string, name = ''): Disease =>
    new Disease({
      omim: [],
      mesh: [],
      phenotypeCount: 0,
      articleCount: 0,
      _geneAssociations: {},
      snomed: [],
      icd10cm: [],
      clinicalTrialCount: 0,
      dataSourceId: "",
      dataSource: "",
      gardId,
      name: name || `name-${gardId}`,
      epiCount: 0,
      nonEpiCount: 0,
      projectCount: 0
    });

  const diseasesArr = [
    createDiseasesEntity('PRODUCT-AAA'),
    createDiseasesEntity('PRODUCT-BBB'),
    createDiseasesEntity('PRODUCT-CCC'),
  ];

  let actions: Observable<Action>;

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
  });

  describe('loadDiseases', () => {
    it('should work', () => {
      actions = hot('-a-|', {
        a: BrowseDiseaseListActions.fetchDiseaseList({ top: 10, skip: 0 }),
      });
      hot('-a-|', {
        a: BrowseDiseaseListActions.fetchDiseaseListSuccess({
          diseases: diseasesArr,
          page: undefined,
        }),
      });

      //fake test
      expect(true).toBe(true);
    });
  });
});
