import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormControl, FormGroup } from '@angular/forms'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TextboxQuestion } from './question-base'
import { NcatsFormQuestionComponent } from './ncats-form-question.component'

describe('NcatsFormQuestionComponent', () => {
  let component: NcatsFormQuestionComponent
  let fixture: ComponentFixture<NcatsFormQuestionComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NcatsFormQuestionComponent, NoopAnimationsModule],
    }).compileComponents()

    fixture = TestBed.createComponent(NcatsFormQuestionComponent)
    component = fixture.componentInstance
    component.question = new TextboxQuestion({ label: 'test' })
    component.form = new FormGroup({
      test: new FormControl<string>(''),
    })
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
