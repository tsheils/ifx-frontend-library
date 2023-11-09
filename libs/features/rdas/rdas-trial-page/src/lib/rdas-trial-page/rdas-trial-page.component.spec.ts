import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdasTrialPageComponent } from './rdas-trial-page.component';

describe('RdasTrialPageComponent', () => {
  let component: RdasTrialPageComponent;
  let fixture: ComponentFixture<RdasTrialPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RdasTrialPageComponent],
    });
    fixture = TestBed.createComponent(RdasTrialPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
