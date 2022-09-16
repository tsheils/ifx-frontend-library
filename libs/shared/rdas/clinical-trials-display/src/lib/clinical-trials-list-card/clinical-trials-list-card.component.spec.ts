import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalTrialsListCardComponent } from './clinical-trials-list-card.component';

describe('ClinicalTrialsListCardComponent', () => {
  let component: ClinicalTrialsListCardComponent;
  let fixture: ComponentFixture<ClinicalTrialsListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicalTrialsListCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicalTrialsListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
