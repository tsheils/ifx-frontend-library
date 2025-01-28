import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BARDATA } from '../../test-setup'
import { SharedUtilsBarChartComponent } from './shared-utils-bar-chart.component'

describe('SharedUtilsBarChartComponent', () => {
  let component: SharedUtilsBarChartComponent
  let fixture: ComponentFixture<SharedUtilsBarChartComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUtilsBarChartComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(SharedUtilsBarChartComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
