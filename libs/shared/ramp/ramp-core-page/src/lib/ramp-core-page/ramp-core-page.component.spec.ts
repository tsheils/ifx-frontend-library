import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActivatedRoute } from '@angular/router';
import { StoreModule } from '@ngrx/store'
import { RAMP_STORE_FEATURE_KEY, rampReducer } from 'ramp-store'
import { RampCorePageComponent } from './ramp-core-page.component'

describe('RampCorePageComponent', () => {
  let component: RampCorePageComponent
  let fixture: ComponentFixture<RampCorePageComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RampCorePageComponent,
        StoreModule.forRoot({}),
        StoreModule.forFeature(RAMP_STORE_FEATURE_KEY, rampReducer),
      ],
      providers: [{ provide: ActivatedRoute, useValue: {} as ActivatedRoute }]
    }).compileComponents()

    fixture = TestBed.createComponent(RampCorePageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
