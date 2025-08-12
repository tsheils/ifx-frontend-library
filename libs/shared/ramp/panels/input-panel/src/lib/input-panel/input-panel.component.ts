import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component, computed,
  input,
  output, signal,
  ViewEncapsulation
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
  isValid = signal(true)
  formMap: Map<string, FormGroup> = new Map<string, FormGroup>();

  setForm(form: FormGroup, key: string) {
    form.statusChanges.subscribe(change => {
      if(change === 'INVALID') {
        this.isValid.set(false)
      } else {
        this.isValid.set(true)
      }
    })
    this.formMap.set(key, form);
  }

  fetchData() {
    const formValues = this.getValuesFromForm()
    console.log(formValues)
    this.dataSearch.emit(formValues);
  }

  cleanLabel(label: string): string {
    return label.replace(/-/g, ' ');
  }

  getValuesFromForm(): { [key: string]: unknown }{
    let formValues: { [key: string]: unknown } = {};
    Array.from(this.formMap.values()).forEach((form) => {
      formValues = { ...formValues, ...form.value };
    });
    return formValues;
  }
  _originalOrder = () => 0;
}
