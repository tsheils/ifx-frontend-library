import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { OpenApiPath } from '@ncats-frontend-library/models/utils';
import { Store } from '@ngrx/store';
import { DataProperty } from '@ncats-frontend-library/models/utils';
import { QuestionBase } from 'ncats-form-question';
import { AccordionPanelMap } from 'panel-accordion';
import { RampDataGeneric } from 'ramp';

@Component({
  selector: 'lib-ramp-core-page',
  standalone: true,
  imports: [CommonModule],
  template: '',
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  dataColumns!: DataProperty[];
  dataframe!: unknown[];
  accordionPanelMap = new AccordionPanelMap();
  dataMapSignal = signal(this.accordionPanelMap);

  fetchData(event?: { [key: string]: unknown }) {
    console.log(event);
  }

  clearDataMapSignal() {
    this.loadedEvent.emit({ dataLoaded: false, resultsLoaded: false });
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
