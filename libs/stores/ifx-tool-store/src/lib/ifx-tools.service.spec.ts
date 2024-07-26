import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IfxToolsService } from './ifx-tools.service';

describe('IfxToolsService', () => {
  let service: IfxToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(IfxToolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
