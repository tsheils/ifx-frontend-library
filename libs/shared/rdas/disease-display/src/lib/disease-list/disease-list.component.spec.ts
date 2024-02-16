import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { Disease } from '@ncats-frontend-library/models/rdas';
import { DiseaseListComponent } from './disease-list.component';

describe('DiseaseListComponent', () => {
  let component: DiseaseListComponent;
  let fixture: ComponentFixture<DiseaseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DiseaseListComponent,
        MatCardModule,
        MatTabsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DiseaseListComponent);
    component = fixture.componentInstance;
    component.diseases = signal([new Disease({ name: 'sdgsg', gardId: 'bddfdf' })]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
