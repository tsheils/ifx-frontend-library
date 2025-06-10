import {
  Component,
  Directive,
  HostListener,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Directive({
  standalone: true,
  selector: '[dndFileInput]',
})
export class DndFileInputDirective {
  fileDrop = output<DragEvent>();
  fileLoading = output<boolean>();

  @HostListener('dragover', ['$event'])
  dragHandler(event: DragEvent) {
    this.fileLoading.emit(true);
    event.preventDefault();
  }

  @HostListener('dragleave', ['$event'])
  dragOffHandler(event: DragEvent) {
    this.fileLoading.emit(false);
    event.preventDefault();
  }

  @HostListener('drop', ['$event'])
  dropHandler(event: DragEvent) {
    event.preventDefault();
    this.fileDrop.emit(event);
  }
}

@Component({
  selector: 'lib-dnd-file-upload',
  imports: [
    CommonModule,
    MatIcon,
    MatIconButton,
    MatProgressSpinner,
    DndFileInputDirective,
    MatButton,
  ],
  templateUrl: './dnd-file-upload.component.html',
  styleUrl: './dnd-file-upload.component.scss',
  standalone: true,
})
export class DndFileUploadComponent {
  multiple = input<boolean | undefined>(false);
  label = input<string>('');
  fileLoading = signal<boolean>(false);
  files = signal<File[]>([]);
  selectedFiles = output<File[]>();

  writeValue(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target?.files?.length) {
      this.files.set((<unknown>target?.files) as File[]);
      this.selectedFiles.emit(this.files());
    }
  }

  removeFile(index: number) {
    const currentFiles = Array.from(this.files()!) as File[];
    const retArr: File[] = currentFiles.filter((file, idx) => idx !== index);
    this.files.set(retArr);
    this.selectedFiles.emit(this.files());
  }

  dropHandler(ev: DragEvent) {
    const dataTransfer: DataTransfer = ev.dataTransfer as DataTransfer;
    if (dataTransfer.items) {
      Array.from(dataTransfer.items).forEach((item: DataTransferItem, i) => {
        if (item.kind === 'file') {
          const file = item.getAsFile() as File;
          this.files.set(this.files()!.concat([file]));
        }
        this.selectedFiles.emit(this.files());
        this.fileLoading.set(false);
      });
    } else {
      Array.from(dataTransfer.files).forEach((file: File) => {
        this.files.set((<unknown>dataTransfer.files) as File[]);
        this.selectedFiles.emit(this.files());
        this.fileLoading.set(false);
      });
    }
  }

  getSize(inputSize: number) {
    const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    const exponent = Math.min(
      Math.floor(Math.log(inputSize) / Math.log(1024)),
      units.length - 1
    );
    const approx = inputSize / 1024 ** exponent;
    return exponent === 0
      ? `${inputSize} bytes`
      : `${approx.toFixed(3)} ${units[exponent]} (${inputSize} bytes)`;
  }
}
