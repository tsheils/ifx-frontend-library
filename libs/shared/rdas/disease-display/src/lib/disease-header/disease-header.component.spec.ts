import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Disease } from "@ncats-frontend-library/models/rdas";
import { SharedRdasSubscribeButtonModule } from "@ncats-frontend-library/shared/rdas/subscribe-button";
import { reducer, USERS_FEATURE_KEY, UsersEffects, UsersFacade } from "@ncats-frontend-library/stores/user-store";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { COMMON_CONFIG, FIRESTORESTUB } from "../../../../../../stores/user-store/src/lib/user.service.spec";

import { DiseaseHeaderComponent } from './disease-header.component';

describe('DiseaseHeaderComponent', () => {
  let component: DiseaseHeaderComponent;
  let fixture: ComponentFixture<DiseaseHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiseaseHeaderComponent ],
      imports: [
        SharedRdasSubscribeButtonModule,
        StoreModule.forRoot({},),
        EffectsModule.forRoot([]),
        StoreModule.forFeature(USERS_FEATURE_KEY, reducer),
        EffectsModule.forFeature([UsersEffects]),
        AngularFireModule.initializeApp(COMMON_CONFIG)
      ],
      providers: [
        UsersFacade,
        { provide: AngularFirestore, useValue: FIRESTORESTUB }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiseaseHeaderComponent);
    component = fixture.componentInstance;
    component.disease= new Disease({name: 'tim', gardId: 'GARD:1234'})
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
