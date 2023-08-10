import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Disease } from "@ncats-frontend-library/models/rdas";
import { SharedRdasSubscribeButtonModule } from "@ncats-frontend-library/shared/rdas/subscribe-button";
import { DiseasesFacade } from "@ncats-frontend-library/stores/disease-store";
import {
  reducer,
  USERS_FEATURE_KEY,
  UsersEffects,
  UsersFacade,
  COMMON_CONFIG,
  FIRESTORESTUB,
  UserService
} from "@ncats-frontend-library/stores/user-store";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { DiseaseHeaderComponent } from '../disease-header/disease-header.component';

import { DiseaseDisplayComponent } from './disease-display.component';

describe('DiseaseDisplayComponent', () => {
  let component: DiseaseDisplayComponent;
  let fixture: ComponentFixture<DiseaseDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DiseaseDisplayComponent,
        DiseaseHeaderComponent,
        IdentifiersDisplayComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        MatTabsModule,
        MatCardModule,
        MatIconModule,
        SharedRdasSubscribeButtonModule,
        StoreModule.forRoot({},),
        EffectsModule.forRoot([]),
        StoreModule.forFeature(USERS_FEATURE_KEY, reducer),
        EffectsModule.forFeature([UsersEffects]),
        AngularFireModule.initializeApp(COMMON_CONFIG)
      ],
      providers: [
        UserService,
        DiseasesFacade,
        UsersFacade,
        { provide: AngularFireAuth, useValue: { } },
        { provide: AngularFirestore, useValue: FIRESTORESTUB }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiseaseDisplayComponent);
    component = fixture.componentInstance;
    component.disease= new Disease({name: 'tim', gardId: 'GARD:1234'})
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
