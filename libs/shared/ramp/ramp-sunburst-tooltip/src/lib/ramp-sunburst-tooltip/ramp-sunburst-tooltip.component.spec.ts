import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RampSunburstTooltipComponent } from './ramp-sunburst-tooltip.component'

describe('RampSunburstTooltipComponent', () => {
  let component: RampSunburstTooltipComponent
  let fixture: ComponentFixture<RampSunburstTooltipComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RampSunburstTooltipComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(RampSunburstTooltipComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
