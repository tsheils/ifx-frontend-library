import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'lib-shared-forms-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './shared-forms-file-upload.component.html',
  styleUrls: ['./shared-forms-file-upload.component.scss'],
})
export class SharedUtilsFileUploadComponent {
  @ViewChild('fileUpload') fileUpload!: ElementRef;
  @Output() fileSelect: EventEmitter<File | null> =
    new EventEmitter<File | null>();
  fileName = '';
  file?: File | undefined | null;

  constructor(private ref: ChangeDetectorRef) {}

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target?.files?.length) {
      this.file = target?.files[0];
      if (this.file) {
        this.fileName = this.file.name;
        this.ref.markForCheck();
        this.fileSelect.emit(this.file);
      }
    }
  }

  cancelUpload() {
    this.fileName = '';
    this.fileUpload.nativeElement.value = '';
    this.file = undefined;
    this.fileSelect.emit(null);
    this.ref.markForCheck();
  }
}
