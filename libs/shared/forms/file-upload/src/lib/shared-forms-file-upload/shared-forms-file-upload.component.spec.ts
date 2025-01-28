import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SharedFormsFileUploadComponent } from './shared-forms-file-upload.component'

describe('SharedUtilsFileUploadComponent', () => {
  let component: SharedFormsFileUploadComponent
  let fixture: ComponentFixture<SharedFormsFileUploadComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedFormsFileUploadComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(SharedFormsFileUploadComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
