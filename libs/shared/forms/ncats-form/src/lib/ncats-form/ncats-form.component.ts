import {
  Component,
  computed,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { NcatsFormQuestionComponent, QuestionBase } from 'ncats-form-question';

@Component({
  selector: 'lib-ncats-form',
  imports: [CommonModule, ReactiveFormsModule, NcatsFormQuestionComponent],
  templateUrl: './ncats-form.component.html',
  styleUrl: './ncats-form.component.scss',
  standalone: true,
})
export class NcatsFormComponent {
  @Input() questions: QuestionBase<string>[] | null = [];
  @Output() formCreated: EventEmitter<FormGroup> =
    new EventEmitter<FormGroup>();
  form = computed(() => {
    const retForm = this.toFormGroup(this.questions as QuestionBase<string>[]);
    this.formCreated.emit(retForm);
    return retForm;
  });

  toFormGroup(questions: QuestionBase<string>[]) {
    const group: { [key: string]: FormControl } = {};
    questions?.forEach((question) => {
      group[question.key] = question.required
        ? new FormControl(question.value || '', Validators.required)
        : new FormControl(question.value || '');
    });
    return new FormGroup(group);
  }
}
