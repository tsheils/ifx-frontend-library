import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  HierarchyNode,
  OpenApiPath,
} from '@ncats-frontend-library/models/utils';
import { Store } from '@ngrx/store';
import { DataProperty } from 'ncats-datatable';
import { QuestionBase } from 'ncats-form-question';
import { RampDataGeneric, RampResults } from 'ramp';

@Component({
  selector: 'lib-ramp-core-page',
  standalone: true,
  imports: [CommonModule],
  template: '',
  styles: '',
})
export class RampCorePageComponent {
  protected readonly store = inject(Store);
  destroyRef = inject(DestroyRef);
  changeRef = inject(ChangeDetectorRef);
  protected dom = inject(DOCUMENT);
  readonly dialog = inject(MatDialog);
  readonly sanitizer: DomSanitizer = inject(DomSanitizer);
  dataColumns!: DataProperty[];
  downloadQueued = false;

  @Output() readonly loadedEvent: EventEmitter<{
    resultsLoaded?: boolean;
    visualizationsLoaded?: boolean;
    dataLoaded?: boolean;
  }> = new EventEmitter<{
    resultsLoaded?: boolean;
    visualizationsLoaded?: boolean;
    dataLoaded?: boolean;
  }>();
  @Input() title = '';
  @Input() paths?: OpenApiPath[];
  @Input() inputMap!: Map<string, QuestionBase<string>[]>;
  resultsLoaded = signal(false);
  visualizationsLoaded = signal(false);
  dataLoaded = signal(false);

  fileName = '';
  file?: File;
  inputList: string[] = [];
  resultsMap!: RampResults;
  visualizationMap: Map<
    string,
    {
      type: string;
      data: { tooBig?: boolean; image?: SafeHtml; values?: HierarchyNode[] };
    }[]
  > = new Map<
    string,
    {
      type: string;
      data: { tooBig?: boolean; image?: SafeHtml; values?: HierarchyNode[] };
    }[]
  >();
  dataMap: Map<
    string,
    { data: { [key: string]: DataProperty }[]; fields: DataProperty[] }
  > = new Map<
    string,
    { data: { [key: string]: DataProperty }[]; fields: DataProperty[] }
  >();
  dataAsDataProperty: { [key: string]: DataProperty }[] = [];
  dataframe!: unknown[];

  fetchData(event?: { [key: string]: unknown }) {
    console.log(event);
  }

  downloadData(event: { [key: string]: unknown }, name: string) {
    this.fetchData(event);
    this.downloadQueued = true;

    // this downloads the previous data if the input has changes in ontologies
    /* if (!this.dataframe) {
      this.fetchData(event);
      this.downloadQueued = true;
    } else {
      this._downloadFile(this._toTSV(this.dataframe), name);
    }*/
  }

  _parseInput(input: string | string[]) {
    let retArr: string[] = [];
    if (input && input.length > 0) {
      if (Array.isArray(input)) {
        retArr = input.map((val: string) => (val = val.trim()));
      } else {
        retArr = input
          .trim()
          .split(/[\t\n,;]+/)
          .map((val: string) => val.trim());
      }
    }
    return retArr;
  }

  _toTSV<T extends RampDataGeneric>(
    data: unknown[],
    fields?: string[],
  ): string {
    if (data) {
      // grab the column headings (separated by tabs)
      const headings: string[] = fields
        ? fields
        : Object.keys(data[0] as string[]);
      // iterate over the data
      const rows: string[] = <string[]>data.reduce(
        (acc: string[], c: unknown) => {
          const ret = headings.map((field) => {
            if ((c as T)[field as keyof T]) {
              return (c as T)[(<string>field) as keyof T];
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

  _downloadFile(data: unknown, name: string, type = 'text/tsv') {
    if (this.dom) {
      const file = new Blob([data as Blob], { type: type });
      const link = this.dom.createElement('a');
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(file);
        link.setAttribute('href', url);
        link.setAttribute('download', `${name}`);
        link.style.visibility = 'hidden';
        this.dom.body.appendChild(link);
        link.click();
        this.dom.body.removeChild(link);
      }
    }
  }

  _onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target?.files?.length) {
      this.file = target?.files[0];
      if (this.file) {
        this.fileName = this.file.name;
        this.changeRef.markForCheck();
      }
    }
  }

  protected _mapData<T extends RampDataGeneric>(
    data: T[],
  ): { [p: string]: DataProperty }[] {
    const dataAsDataProperty: { [key: string]: DataProperty }[] = data.map(
      (obj: T) => {
        const newObj: { [key: string]: DataProperty } = {};
        Object.entries(obj).map((value: string[]) => {
          newObj[value[0]] = new DataProperty({
            // name: value[0],
            label: value[0],
            value: value[1],
          });
        });
        return newObj;
      },
    );
    return dataAsDataProperty;
  }
}
