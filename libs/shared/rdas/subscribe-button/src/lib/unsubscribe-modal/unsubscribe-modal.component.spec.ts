import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { reducer, USERS_FEATURE_KEY, UsersEffects, UsersFacade } from "@ncats-frontend-library/stores/user-store";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { UserService } from "../../../../../../stores/user-store/src/lib/user.service";
import { COMMON_CONFIG, FIRESTORESTUB } from "../../../../../../stores/user-store/src/lib/user.service.spec";

import { UnsubscribeModalComponent } from './unsubscribe-modal.component';

describe('UnsubscribeModalComponent', () => {
  let component: UnsubscribeModalComponent;
  let fixture: ComponentFixture<UnsubscribeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsubscribeModalComponent ],
      imports: [
        MatDialogModule,
        MatButtonModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        StoreModule.forFeature(USERS_FEATURE_KEY, reducer),
        EffectsModule.forFeature([UsersEffects]),
        AngularFireModule.initializeApp(COMMON_CONFIG)
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: AngularFirestore, useValue: FIRESTORESTUB },
        UsersFacade,
        UserService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnsubscribeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
