import {
  Component,
  computed,
  ElementRef,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'lib-shared-forms-file-upload',
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: SharedFormsFileUploadComponent,
        },
    ],
    templateUrl: './shared-forms-file-upload.component.html',
    styleUrls: ['./shared-forms-file-upload.component.scss']
})
export class SharedFormsFileUploadComponent implements ControlValueAccessor {
  fileUpload = viewChild(ElementRef);
  fileSelect = output<File | null>();
  fileName = computed(() => this.file()?.name || null);
  file = signal<File | null>(null);
  touched = false;
  disabled = false;

  //eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (file: File | null) => {};

  //eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  cancelUpload() {
    if (this.fileUpload()) {
      const nativeElement = this.fileUpload()?.nativeElement;
      nativeElement.value = '';
      this.file.set(null);
      this.onChange(this.file());
    }
  }

  writeValue(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target?.files?.length) {
      this.file.set(target?.files[0]);
      this.onChange(this.file());
    }
  }

  registerOnChange(onChange: never) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: never) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
}
