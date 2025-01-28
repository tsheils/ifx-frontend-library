import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import {
  DISEASES_FEATURE_KEY,
  diseasesReducer,
} from '@ncats-frontend-library/stores/disease-store'
import {
  USERS_FEATURE_KEY,
  usersReducer,
} from '@ncats-frontend-library/stores/user-store'
import { StoreModule } from '@ngrx/store'
import { SUBSCRIPTIONLISTMOCK } from '../../test-setup'

import { DiseaseSubscriptionListComponent } from './disease-subscription-list.component'

describe('DiseaseSubscriptionListComponent', () => {
  let component: DiseaseSubscriptionListComponent
  let fixture: ComponentFixture<DiseaseSubscriptionListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DiseaseSubscriptionListComponent,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(DISEASES_FEATURE_KEY, diseasesReducer),
        StoreModule.forFeature(USERS_FEATURE_KEY, usersReducer),
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(DiseaseSubscriptionListComponent)
    component = fixture.componentInstance
    component.subscriptions = SUBSCRIPTIONLISTMOCK.subscriptions
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
