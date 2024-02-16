import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { Disease } from '@ncats-frontend-library/models/rdas';


import { DiseaseListCardComponent } from './disease-list-card.component';

describe('DiseaseListCardComponent', () => {
  let component: DiseaseListCardComponent;
  let fixture: ComponentFixture<DiseaseListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        MatCardModule,
        DiseaseListCardComponent
      ],
      providers: [
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DiseaseListCardComponent);
    component = fixture.componentInstance;
    component.disease = new Disease({ name: 'tim', gardId: 'GARD:1234' });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
