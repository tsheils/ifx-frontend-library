import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { PanelAccordionComponent } from './panel-accordion.component'

describe('PanelAccordionComponent', () => {
  let component: PanelAccordionComponent
  let fixture: ComponentFixture<PanelAccordionComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, PanelAccordionComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(PanelAccordionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
