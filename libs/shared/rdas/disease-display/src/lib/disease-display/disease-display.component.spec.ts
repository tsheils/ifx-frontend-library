import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { MatTabsModule } from "@angular/material/tabs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Disease } from "@ncats-frontend-library/models/rdas";
import { SharedRdasSubscribeButtonModule } from "@ncats-frontend-library/shared/rdas/subscribe-button";
import { DiseasesFacade } from "@ncats-frontend-library/stores/disease-store";
import { reducer, USERS_FEATURE_KEY, UsersEffects, UsersFacade } from "@ncats-frontend-library/stores/user-store";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { COMMON_CONFIG, FIRESTORESTUB } from "../../../../../../stores/user-store/src/lib/user.service.spec";
import { DiseaseHeaderComponent } from '../disease-header/disease-header.component';
import { IdentifiersDisplayComponent } from '../identifiers-display/identifiers-display.component';

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
        SharedRdasSubscribeButtonModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        StoreModule.forFeature(USERS_FEATURE_KEY, reducer),
        EffectsModule.forFeature([UsersEffects]),
        AngularFireModule.initializeApp(COMMON_CONFIG)
      ],
      providers: [
        UsersFacade,
        DiseasesFacade,
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
