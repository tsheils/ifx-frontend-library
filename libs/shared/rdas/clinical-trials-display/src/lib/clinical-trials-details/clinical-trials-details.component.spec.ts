import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { ClinicalTrialsDetailsComponent } from './clinical-trials-details.component';

describe('ClinicalTrialsDetailsComponent', () => {
  let component: ClinicalTrialsDetailsComponent;
  let fixture: ComponentFixture<ClinicalTrialsDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ClinicalTrialsDetailsComponent
      ],
    });
    fixture = TestBed.createComponent(ClinicalTrialsDetailsComponent);
    component = fixture.componentInstance;
    component.trial = { NCTId: "h", briefSummary: 'yo'}
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
