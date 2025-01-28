import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RampGraphLegendComponent } from './ramp-graph-legend.component'

describe('RampGraphLegendComponent', () => {
  let component: RampGraphLegendComponent
  let fixture: ComponentFixture<RampGraphLegendComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RampGraphLegendComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(RampGraphLegendComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
