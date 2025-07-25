import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatOption, MatSelect } from '@angular/material/select';
import { SharedFormsFileUploadComponent } from '@ncats-frontend-library/shared/forms/file-upload';
import { QuestionBase } from './question-base';

@Component({
  selector: 'lib-ncats-form-question',
  imports: [
    CommonModule,
    MatRadioButton,
    MatRadioGroup,
    FormsModule,
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    MatInput,
    MatSelect,
    MatOption,
    SharedFormsFileUploadComponent,
  ],
  templateUrl: './ncats-form-question.component.html',
  styleUrl: './ncats-form-question.component.scss',
  standalone: true,
})
export class NcatsFormQuestionComponent {
  @Input() question!: QuestionBase<string>;
  @Input() form!: FormGroup;
  get isValid() {
    return (
      this.form.controls[this.question.key]?.disabled ||
      this.form.controls[this.question.key]?.valid
    );
  }

  getWidth(question: QuestionBase<string>) {
    return question.width ? `width-${question.width}` : 'width-95';
  }
}
