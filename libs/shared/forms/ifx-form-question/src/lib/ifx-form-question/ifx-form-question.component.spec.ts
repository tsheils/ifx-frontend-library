import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { TextboxQuestion } from './question-base';
import { IfxFormQuestionComponent } from './ifx-form-question.component';

describe('IfxFormQuestionComponent', () => {
  let component: IfxFormQuestionComponent;
  let fixture: ComponentFixture<IfxFormQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IfxFormQuestionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IfxFormQuestionComponent);
    component = fixture.componentInstance;
    component.question = new TextboxQuestion({ label: 'test' });
    component.form = new FormGroup({
      test: new FormControl<string>(''),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
