import {
  Component,
  computed,
  ElementRef,
  input,
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
  styleUrls: ['./shared-forms-file-upload.component.scss'],
  standalone: true,
})
export class SharedFormsFileUploadComponent implements ControlValueAccessor {
  fileUpload = viewChild(ElementRef);
  fileSelect = output<File | null>();
  //fileName = computed(() => this.files()?[0].name || null);
  files = signal<File[] | undefined>(undefined);
  touched = false;
  multiple = input<boolean | undefined>(false);

  //eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (files: File[] | undefined) => {};

  //eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  cancelUpload() {
    if (this.fileUpload()) {
      const nativeElement = this.fileUpload()?.nativeElement;
      nativeElement.value = '';
      this.files.set(undefined);
      this.onChange(this.files());
    }
  }

  writeValue(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target?.files?.length) {
      this.files.set((<unknown>target?.files) as File[]);
      this.onChange(this.files());
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

  removeFile(index: number) {
    const currentFiles = Array.from(this.files()!) as File[];
    const retArr: File[] = currentFiles.filter((file, idx) => idx !== index);
    this.files.set(retArr);
  }
}
