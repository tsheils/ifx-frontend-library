import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { ClinicalTrial } from 'rdas-models';

import { ClinicalTrialsListCardComponent } from './clinical-trials-list-card.component';

describe('ClinicalTrialsListCardComponent', () => {
  let component: ClinicalTrialsListCardComponent;
  let fixture: ComponentFixture<ClinicalTrialsListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [MatCardModule, ClinicalTrialsListCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClinicalTrialsListCardComponent);
    component = fixture.componentInstance;
    component.trial = new ClinicalTrial({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
