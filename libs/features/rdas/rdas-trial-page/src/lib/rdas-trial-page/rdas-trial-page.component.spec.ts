import { ComponentFixture, TestBed } from '@angular/core/testing'
import {
  trialsReducer,
  TrialEffects,
} from '@ncats-frontend-library/stores/trial-store'
import { provideEffects } from '@ngrx/effects'
import { provideStore, StoreModule } from '@ngrx/store'
import { provideStoreDevtools } from '@ngrx/store-devtools'

import { RdasTrialPageComponent } from './rdas-trial-page.component'

describe('RdasTrialPageComponent', () => {
  let component: RdasTrialPageComponent
  let fixture: ComponentFixture<RdasTrialPageComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RdasTrialPageComponent, StoreModule],
      providers: [
        provideStore({
          trials: trialsReducer,
        }),
        provideEffects([TrialEffects]),
        provideStoreDevtools({ maxAge: 25, logOnly: false }),
      ],
    })
    fixture = TestBed.createComponent(RdasTrialPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
