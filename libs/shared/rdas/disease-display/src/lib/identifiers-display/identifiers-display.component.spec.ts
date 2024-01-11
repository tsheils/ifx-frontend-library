import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { reducer, USERS_FEATURE_KEY, UsersEffects } from "@ncats-frontend-library/stores/user-store";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { COMMON_CONFIG, FIRESTORESTUB } from '@ncats-frontend-library/stores/user-store';
import { DiseaseHeaderComponent } from '../disease-header/disease-header.component';
import {
  SubscribeButtonComponent
} from "@ncats-frontend-library/shared/rdas/subscribe-button";

import { IdentifiersDisplayComponent } from './identifiers-display.component';

describe('IdentifiersDisplayComponent', () => {
  let component: IdentifiersDisplayComponent;
  let fixture: ComponentFixture<IdentifiersDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentifiersDisplayComponent, DiseaseHeaderComponent ],
      imports: [
        SubscribeButtonComponent,
        StoreModule.forRoot({},),
        EffectsModule.forRoot([]),
        StoreModule.forFeature(USERS_FEATURE_KEY, reducer),
        EffectsModule.forFeature([UsersEffects]),
        AngularFireModule.initializeApp(COMMON_CONFIG)
      ],
      providers: [
        { provide: AngularFirestore, useValue: FIRESTORESTUB }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdentifiersDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
