import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { reducer, USERS_FEATURE_KEY, UsersEffects, UsersFacade, UserService } from "@ncats-frontend-library/stores/user-store";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { COMMON_CONFIG, FIRESTORESTUB } from "../../../../../../stores/user-store/src/lib/user.service.spec";

import { SubscribeButtonComponent } from './subscribe-button.component';

describe('SubscribeButtonComponent', () => {
  let component: SubscribeButtonComponent;
  let fixture: ComponentFixture<SubscribeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscribeButtonComponent ],
      imports: [
        MatDialogModule,
        MatSnackBarModule,
        MatMenuModule,
        MatCheckboxModule,
        MatIconModule,
        MatButtonModule,
        StoreModule.forRoot({},),
        EffectsModule.forRoot([]),
        StoreModule.forFeature(USERS_FEATURE_KEY, reducer),
        EffectsModule.forFeature([UsersEffects]),
        AngularFireModule.initializeApp(COMMON_CONFIG)
      ],
      providers: [
        UsersFacade,
        UserService,
        {provide: MatDialog, useValue: {}},
        { provide: AngularFirestore, useValue: FIRESTORESTUB }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscribeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
