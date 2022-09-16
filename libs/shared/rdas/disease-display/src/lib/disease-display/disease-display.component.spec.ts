import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseaseDisplayComponent } from './disease-display.component';

describe('DiseaseDisplayComponent', () => {
  let component: DiseaseDisplayComponent;
  let fixture: ComponentFixture<DiseaseDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiseaseDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiseaseDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
