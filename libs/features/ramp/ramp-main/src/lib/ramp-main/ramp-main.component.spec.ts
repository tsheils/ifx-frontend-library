import { CommonModule } from '@angular/common'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { ActivatedRoute } from '@angular/router'
import { StoreModule } from '@ngrx/store'
import { RAMP_STORE_FEATURE_KEY, rampReducer } from 'ramp-store'
import { RampMainComponent } from './ramp-main.component'

describe('RampMainComponent', () => {
  let component: RampMainComponent
  let fixture: ComponentFixture<RampMainComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NoopAnimationsModule,
        RampMainComponent,
        StoreModule.forRoot({}),
        StoreModule.forFeature(RAMP_STORE_FEATURE_KEY, rampReducer),
      ],
      providers: [{ provide: ActivatedRoute, useValue: {} }],
    }).compileComponents()

    fixture = TestBed.createComponent(RampMainComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
