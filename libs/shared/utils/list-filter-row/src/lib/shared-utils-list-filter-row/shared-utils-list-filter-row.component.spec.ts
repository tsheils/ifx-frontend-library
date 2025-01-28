import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SharedUtilsListFilterRowComponent } from './shared-utils-list-filter-row.component'

describe('SharedUtilsListFilterRowComponent', () => {
  let component: SharedUtilsListFilterRowComponent
  let fixture: ComponentFixture<SharedUtilsListFilterRowComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedUtilsListFilterRowComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(SharedUtilsListFilterRowComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
