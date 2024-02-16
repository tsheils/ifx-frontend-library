import { TestBed } from '@angular/core/testing';
import { Apollo } from "apollo-angular";

import { FilterService } from './filter.service';

describe('FilterService', () => {
  let service: FilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Apollo]
    });
    service = TestBed.inject(FilterService);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
