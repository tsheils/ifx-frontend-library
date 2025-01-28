import { TestBed } from '@angular/core/testing'
import { Apollo } from 'apollo-angular'

import { GrantService } from './grant.service'

describe('GrantService', () => {
  let service: GrantService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Apollo],
    })
    service = TestBed.inject(GrantService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
