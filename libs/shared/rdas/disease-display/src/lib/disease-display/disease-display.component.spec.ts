import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Disease } from '@ncats-frontend-library/models/rdas';
import { DiseaseDisplayComponent } from './disease-display.component';

describe('DiseaseDisplayComponent', () => {
  let component: DiseaseDisplayComponent;
  let fixture: ComponentFixture<DiseaseDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatTabsModule,
        MatCardModule,
        MatIconModule,
        DiseaseDisplayComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DiseaseDisplayComponent);
    component = fixture.componentInstance;
    component.disease = signal(new Disease({ name: 'tim', gardId: 'GARD:1234' }));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
