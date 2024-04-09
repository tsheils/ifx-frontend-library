import { TestBed } from '@angular/core/testing';

import { IfxToolsService } from './ifx-tool.service';

describe('IfxToolService', () => {
  let service: IfxToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IfxToolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
