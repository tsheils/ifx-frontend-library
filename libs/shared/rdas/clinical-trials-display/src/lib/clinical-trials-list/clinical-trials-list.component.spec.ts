import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from "@angular/material/card";

import { ClinicalTrialsListComponent } from './clinical-trials-list.component';

describe('ClinicalTrialsListComponent', () => {
  let component: ClinicalTrialsListComponent;
  let fixture: ComponentFixture<ClinicalTrialsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicalTrialsListComponent ],
      imports: [
        MatCardModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicalTrialsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
