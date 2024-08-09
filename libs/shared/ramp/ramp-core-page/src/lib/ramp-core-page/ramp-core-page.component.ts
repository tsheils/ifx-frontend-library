import {
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  output,
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

  readonly loadedEvent = output<{
    resultsLoaded?: boolean;
    visualizationsLoaded?: boolean;
    dataLoaded?: boolean;
  }>();

  title = input<string>();
  paths = input<OpenApiPath[]>();
  inputMap = input<Map<string, QuestionBase<string>[]>>();
  filtersMap = input<Map<string, QuestionBase<string>[]>>();

  inputList: string[] = [];
  resultsMap!: RampResults;
  dataColumns!: DataProperty[];
  downloadQueued = false;
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
    {
      data: { [key: string]: DataProperty }[];
      fields: DataProperty[];
      dataframe?: unknown[];
      fileName?: string;
      filters?: Map<string, QuestionBase<string>[]>;
    }
  > = new Map<
    string,
    { data: { [key: string]: DataProperty }[]; fields: DataProperty[] }
  >();
  dataAsDataProperty: { [key: string]: DataProperty }[] = [];
  dataframe!: unknown[];

  fetchData(event?: { [key: string]: unknown }) {
    console.log(event);
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
