import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { Disease } from '@ncats-frontend-library/models/rdas';
import {
  COMMON_CONFIG,
  FIRESTORESTUB,
  reducer,
  USERS_FEATURE_KEY,
  UsersEffects,
  UserService,
  UsersFacade,
} from '@ncats-frontend-library/stores/user-store';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DiseaseListCardComponent } from '../disease-list-card/disease-list-card.component';
import { DiseaseHeaderComponent } from '../disease-header/disease-header.component';

import { DiseaseListComponent } from './disease-list.component';

describe('DiseaseListComponent', () => {
  let component: DiseaseListComponent;
  let fixture: ComponentFixture<DiseaseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiseaseListComponent, DiseaseHeaderComponent],
      imports: [
        DiseaseListCardComponent,
        MatCardModule,
        MatTabsModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        StoreModule.forFeature(USERS_FEATURE_KEY, reducer),
        EffectsModule.forFeature([UsersEffects]),
        AngularFireModule.initializeApp(COMMON_CONFIG),
      ],
      providers: [
        UserService,
        UsersFacade,
        { provide: AngularFireAuth, useValue: {} },
        { provide: AngularFirestore, useValue: FIRESTORESTUB },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DiseaseListComponent);
    component = fixture.componentInstance;
    component.diseases = [new Disease({ name: 'sdgsg', gardId: 'bddfdf' })];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
