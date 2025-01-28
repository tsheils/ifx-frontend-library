import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'

import { NcatsDatatableComponent } from './ncats-datatable.component'

describe('NcatsDatatableComponent', () => {
  let component: NcatsDatatableComponent
  let fixture: ComponentFixture<NcatsDatatableComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [NoopAnimationsModule, NcatsDatatableComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(NcatsDatatableComponent)
    component = fixture.componentInstance
    // component.data = [];
    //  component.fieldsConfig = [] as DataProperty[];
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
