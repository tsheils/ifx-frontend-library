import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTab } from '@angular/material/tabs';
import { OpenApiPath } from '@ncats-frontend-library/models/utils';
import { NcatsFormComponent } from 'ncats-form';
import { QuestionBase } from 'ncats-form-question';

@Component({
  selector: 'lib-input-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatFormField,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    NcatsFormComponent,
    MatTab,
  ],
  templateUrl: './input-panel.component.html',
  styleUrl: './input-panel.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class InputPanelComponent {
  showInput = input<boolean>(true);
  showDownload = input<boolean>(true);
  input = input<string>();
  paths = input<OpenApiPath[]>([]);
  inputQuestions = input<Map<string, QuestionBase<string>[]>>();
  label = computed(() => this.paths()[0].example[0].field);
  examples = computed(() => this.paths()[0].example[0].value);
  dataSearch = output<{ [key: string]: unknown }>();

  formMap: Map<string, FormGroup> = new Map<string, FormGroup>();

  setForm(form: FormGroup, key: string) {
    this.formMap.set(key, form);
  }

  fetchData() {
    let formValues: { [key: string]: unknown } = {};
    Array.from(this.formMap.values()).forEach((form) => {
      formValues = { ...formValues, ...form.value };
    });
    this.dataSearch.emit(formValues);
  }

  cleanLabel(label: string): string {
    return label.replace(/-/g, ' ');
  }

  _originalOrder = () => 0;
}
