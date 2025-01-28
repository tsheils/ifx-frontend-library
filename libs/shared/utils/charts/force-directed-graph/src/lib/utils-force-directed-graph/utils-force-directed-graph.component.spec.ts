import { ComponentFixture, TestBed } from '@angular/core/testing'
import { UtilsForceDirectedGraphComponent } from './utils-force-directed-graph.component'

describe('UtilsForceDirectedGraphComponent', () => {
  let component: UtilsForceDirectedGraphComponent
  let fixture: ComponentFixture<UtilsForceDirectedGraphComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilsForceDirectedGraphComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(UtilsForceDirectedGraphComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
