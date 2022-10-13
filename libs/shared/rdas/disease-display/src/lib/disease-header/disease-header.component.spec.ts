import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Disease } from "@ncats-frontend-library/models/rdas";

import { DiseaseHeaderComponent } from './disease-header.component';

describe('DiseaseHeaderComponent', () => {
  let component: DiseaseHeaderComponent;
  let fixture: ComponentFixture<DiseaseHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiseaseHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiseaseHeaderComponent);
    component = fixture.componentInstance;
    component.disease= new Disease({name: 'tim', gard_id: 'GARD:tim'})
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
