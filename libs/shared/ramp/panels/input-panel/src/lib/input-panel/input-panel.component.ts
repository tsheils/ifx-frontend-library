import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NcatsFormComponent } from 'ncats-form';
import { FormSubsection } from 'ramp';

@Component({
  selector: 'lib-input-panel',
  imports: [
    CommonModule,
    MatIcon,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    NcatsFormComponent,
  ],
  templateUrl: './input-panel.component.html',
  styleUrl: './input-panel.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class InputPanelComponent {
  inputQuestions = input<FormSubsection[]>();
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
