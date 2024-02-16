import { TestBed } from '@angular/core/testing';
import { Apollo } from "apollo-angular";

import { TrialService } from './trial.service';

describe('TrialService', () => {
  let service: TrialService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Apollo]
    });
    service = TestBed.inject(TrialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
