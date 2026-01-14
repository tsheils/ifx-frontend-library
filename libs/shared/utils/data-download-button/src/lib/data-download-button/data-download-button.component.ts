import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'lib-data-download-button',
  imports: [CommonModule, MatButton, MatTooltip, MatIcon],
  templateUrl: './data-download-button.component.html',
  styleUrl: './data-download-button.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataDownloadButtonComponent {
  protected dom = inject(DOCUMENT);
  data = input<unknown[]>();
  fields = input<string[]>();
  fileName = input<string>('data-download.tsv');

  dataAsTSV = computed(() => {
    if (this.data() && this.data()?.length) {
      // grab the column headings (separated by tabs)
      let headings: string[] = Object.keys(this.data()![0] as string[]);
      if (this.fields()) {
        headings = this.fields() as string[];
      }
      // iterate over the data
      const rows: string[] = <string[]>this.data()?.reduce(
        (acc: string[], c: unknown) => {
          const ret = headings.map((field) => {
            const f = (c as unknown as { [key: string]: unknown })[field];
            if (f) {
              return f;
            } else {
              return;
            }
          });
          // for each row object get its values and add tabs between them
          // then add them as a new array to the outgoing array
          return acc.concat(ret.join('\t'));

          // finally joining each row with a line break
        },
        [headings.join('\t')],
      );
      return rows.join('\n');
    } else return '';
  });

  _toTSV(data: unknown[], fields?: string[]): string {
    if (data) {
      // grab the column headings (separated by tabs)
      const headings: string[] = fields
        ? fields
        : Object.keys((<unknown>data[0]) as string[]);
      // iterate over the data
      const rows: string[] = <string[]>data.reduce(
        (acc: string[], c: unknown) => {
          const ret = headings.map((field) => {
            const f = (c as unknown as { [key: string]: unknown })[field];
            if (f) {
              return f;
            } else {
              return;
            }
          });
          // for each row object get its values and add tabs between them
          // then add them as a new array to the outgoing array
          return acc.concat(ret.join('\t'));

          // finally joining each row with a line break
        },
        [headings.join('\t')],
      );
      return rows.join('\n');
    } else return '';
  }

  _downloadFile() {
    if (this.dom && this.dataAsTSV()) {
      const file = new Blob([(<unknown>this.dataAsTSV()!) as Blob], {
        type: 'text/tsv',
      });
      const link = this.dom.createElement('a');
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(file);
        link.setAttribute('href', url);
        link.setAttribute('download', `${this.fileName()}`);
        link.style.visibility = 'hidden';
        this.dom.body.appendChild(link);
        link.click();
        this.dom.body.removeChild(link);
      }
    }
  }
}
