import { signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { FilterCategory } from '@ncats-frontend-library/models/utils'
import { PIEFILTERS } from '../../test-setup'
import { ChartWrapperComponent } from './chart-wrapper.component'

describe('ChartWrapperComponent', () => {
  let component: ChartWrapperComponent
  let fixture: ComponentFixture<ChartWrapperComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartWrapperComponent, NoopAnimationsModule],
    }).compileComponents()

    fixture = TestBed.createComponent(ChartWrapperComponent)
    component = fixture.componentInstance
    const filters = signal<FilterCategory[]>([PIEFILTERS as FilterCategory])
    component.filters = filters as unknown as typeof component.filters
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
