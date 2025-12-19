import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { IfxFormQuestionComponent, QuestionBase } from 'ifx-form-question';

@Component({
  selector: 'lib-ifx-form',
  imports: [CommonModule, ReactiveFormsModule, IfxFormQuestionComponent],
  templateUrl: './ifx-form.component.html',
  styleUrl: './ifx-form.component.scss',
  standalone: true,
})
export class IfxFormComponent {
  questions = input<QuestionBase<string>[] | null>([]);
  direction = input<'row' | 'column'>('column');
  formCreated = output<FormGroup>();
  form = computed(() => {
    const retForm = this.toFormGroup(
      this.questions() as QuestionBase<string>[],
    );
    this.formCreated.emit(retForm);
    return retForm;
  });

  toFormGroup(questions: QuestionBase<string>[]) {
    const group: { [key: string]: FormControl } = {};
    questions?.forEach((question) => {
      group[question.key] = question.required
        ? new FormControl(
            { value: question.value || '', disabled: question.disabled },
            Validators.required,
          )
        : new FormControl({
            value: question.value || '',
            disabled: question.disabled,
          });
    });
    return new FormGroup(group);
  }

  getDirection() {
    return this.direction() === 'row';
  }

  getWidth(question: QuestionBase<string>) {
    return question.width ? `width-${question.width}` : 'width-95';
  }
}
