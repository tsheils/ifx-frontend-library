import { TestBed } from '@angular/core/testing'
import { Apollo } from 'apollo-angular'
import { ApolloTestingModule } from 'apollo-angular/testing'

import { DiseaseService } from './disease.service'

describe('DiseaseService', () => {
  let service: DiseaseService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [Apollo],
    })
    service = TestBed.inject(DiseaseService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
