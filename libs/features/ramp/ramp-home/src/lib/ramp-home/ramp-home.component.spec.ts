import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActivatedRoute } from '@angular/router'
import { StoreModule } from '@ngrx/store';
import { RAMP_STORE_FEATURE_KEY, rampReducer } from 'ramp-store';
import { RampHomeComponent } from './ramp-home.component'

describe('RampHomeComponent', () => {
  let component: RampHomeComponent
  let fixture: ComponentFixture<RampHomeComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RampHomeComponent,
        StoreModule.forRoot({}),
        StoreModule.forFeature(RAMP_STORE_FEATURE_KEY, rampReducer)
      ],
      providers: [{ provide: ActivatedRoute, useValue: {} }],
    }).compileComponents()

    fixture = TestBed.createComponent(RampHomeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
