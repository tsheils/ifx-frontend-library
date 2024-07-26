import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  UntypedFormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTab } from '@angular/material/tabs';
import { OpenApiPath } from '@ncats-frontend-library/models/utils';
import { DataPanelComponent } from 'data-panel';
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
    DataPanelComponent,
    MatTab,
  ],
  templateUrl: './input-panel.component.html',
  styleUrl: './input-panel.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class InputPanelComponent {
  @Input() showInput = true;
  @Input() showDownload = true;
  @Input() input!: string;
  @Input() paths?: OpenApiPath[];
  @Input() inputQuestions!: Map<string, QuestionBase<string>[]>;
  formMap: Map<string, FormGroup> = new Map<string, FormGroup>();
  label = computed(() => (this.paths ? this.paths[0].example[0].field : ''));
  examples = computed(() => (this.paths ? this.paths[0].example[0].value : ''));

  @Output() dataSearch: EventEmitter<{ [key: string]: unknown }> =
    new EventEmitter<{ [key: string]: unknown }>();
  @Output() dataDownload: EventEmitter<{ [key: string]: unknown }> =
    new EventEmitter<{ [key: string]: unknown }>();

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

  downloadData() {
    let formValues: { [key: string]: unknown } = {};
    Array.from(this.formMap.values()).forEach((form) => {
      formValues = { ...formValues, ...form.value };
    });
    this.dataDownload.emit(formValues);
  }

  cleanLabel(label: string): string {
    return label.replace(/-/g, ' ');
  }

  _originalOrder = () => 0;
}
