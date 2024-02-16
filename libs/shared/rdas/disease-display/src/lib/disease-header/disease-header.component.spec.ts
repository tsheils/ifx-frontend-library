import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { Disease } from '@ncats-frontend-library/models/rdas';
import { DiseaseHeaderComponent } from './disease-header.component';

describe('DiseaseHeaderComponent', () => {
  let component: DiseaseHeaderComponent;
  let fixture: ComponentFixture<DiseaseHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        DiseaseHeaderComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DiseaseHeaderComponent);
    component = fixture.componentInstance;
    component.disease = signal(new Disease({ name: 'tim', gardId: 'GARD:1234' }));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
