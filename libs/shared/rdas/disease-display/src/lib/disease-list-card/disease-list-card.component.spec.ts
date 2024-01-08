import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatCardModule } from '@angular/material/card';
import { Disease } from '@ncats-frontend-library/models/rdas';
import { SharedRdasSubscribeButtonModule } from '@ncats-frontend-library/shared/rdas/subscribe-button';
import {
  reducer,
  USERS_FEATURE_KEY,
  UsersEffects,
  UsersFacade,
  COMMON_CONFIG,
  FIRESTORESTUB,
} from '@ncats-frontend-library/stores/user-store';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { DiseaseListCardComponent } from './disease-list-card.component';

describe('DiseaseListCardComponent', () => {
  let component: DiseaseListCardComponent;
  let fixture: ComponentFixture<DiseaseListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        MatCardModule,
        SharedRdasSubscribeButtonModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        StoreModule.forFeature(USERS_FEATURE_KEY, reducer),
        EffectsModule.forFeature([UsersEffects]),
        AngularFireModule.initializeApp(COMMON_CONFIG),
        DiseaseListCardComponent,
      ],
      providers: [
        UsersFacade,
        { provide: AngularFirestore, useValue: FIRESTORESTUB },
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
