import { ComponentRef, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TreeChartComponent } from './tree-chart.component'

describe('TreeChartComponent', () => {
  let component: TreeChartComponent
  let fixture: ComponentFixture<TreeChartComponent>
  let componentRef: ComponentRef<TreeChartComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeChartComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(TreeChartComponent)
    component = fixture.componentInstance
    componentRef = fixture.componentRef
    componentRef.setInput('data', [])
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
