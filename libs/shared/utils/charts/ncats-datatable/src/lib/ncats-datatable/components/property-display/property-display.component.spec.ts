import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { PropertyDisplayComponent } from './property-display.component'

describe('PropertyDisplayComponent', () => {
  let component: PropertyDisplayComponent
  let fixture: ComponentFixture<PropertyDisplayComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [PropertyDisplayComponent],
      providers: [],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDisplayComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
