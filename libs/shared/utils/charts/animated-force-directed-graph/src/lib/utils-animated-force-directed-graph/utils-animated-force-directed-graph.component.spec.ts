import { ComponentFixture, TestBed } from '@angular/core/testing'
import { UtilsAnimatedForceDirectedGraphComponent } from './utils-animated-force-directed-graph.component'

describe('UtilsAnimatedForceDirectedGraphComponent', () => {
  let component: UtilsAnimatedForceDirectedGraphComponent
  let fixture: ComponentFixture<UtilsAnimatedForceDirectedGraphComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilsAnimatedForceDirectedGraphComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(UtilsAnimatedForceDirectedGraphComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
