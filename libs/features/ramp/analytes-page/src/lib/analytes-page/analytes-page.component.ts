import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from '@ngrx/store';
import { DataProperty } from 'ncats-datatable';
import { PanelAccordionComponent } from 'panel-accordion';
import { Analyte, RampResponse } from 'ramp';
import { RampCorePageComponent } from 'ramp-core-page';
import { AnalyteFromPathwayActions, RampSelectors } from 'ramp-store';
import { map } from 'rxjs';

@Component({
  selector: 'lib-analytes-page',
  standalone: true,
  imports: [CommonModule, PanelAccordionComponent],
  templateUrl: './analytes-page.component.html',
  styleUrl: './analytes-page.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalytesPageComponent
  extends RampCorePageComponent
  implements OnInit
{
  override dataColumns: DataProperty[] = [
    new DataProperty({
      label: 'Pathway Name',
      field: 'pathwayName',
      sortable: true,
    }),
    new DataProperty({
      label: 'Pathway Type',
      field: 'pathwayType',
      sortable: true,
    }),
    new DataProperty({
      label: 'Analyte Name',
      field: 'analyteName',
      sortable: true,
    }),
    new DataProperty({
      label: 'Source Analyte ID',
      field: 'sourceAnalyteIDs',
      sortable: true,
    }),
    new DataProperty({
      label: 'Analyte Class',
      field: 'geneOrCompound',
      sortable: true,
    }),
    new DataProperty({
      label: 'Pathway ID',
      field: 'pathwayId',
      sortable: true,
    }),
  ];

  constructor() {
    super();
  }

  ngOnInit() {
    this.store
      .pipe(
        select(RampSelectors.getAnalytes),
        takeUntilDestroyed(this.destroyRef),
        map((res: RampResponse<Analyte> | undefined) => {
          if (res && res.data) {
            this.dataMap.set('Analytes', {
              data: this._mapData(res.data),
              fields: this.dataColumns,
              dataframe: res.dataframe,
              fileName: 'fetchAnalytesFromPathways-download.tsv',
            });
            const matches = Array.from(
              new Set(
                res.data.map((analyte) =>
                  analyte.pathwayName.toLocaleLowerCase(),
                ),
              ),
            );
            const noMatches = this.inputList.filter(
              (p: string) => !matches.includes(p.toLocaleLowerCase()),
            );
            this.resultsMap = {
              matches: matches,
              noMatches: noMatches,
              count: res.data.length,
              inputLength: this.inputList.length,
              fuzzy: true,
              inputType: 'pathways',
            };
            this.loadedEvent.emit({ dataLoaded: true, resultsLoaded: true });
          }
          if (res && res.query) {
            this.resultsMap.function = <string>res.query.functionCall;
          }
        }),
      )
      .subscribe();
  }

  override fetchData(event: { [key: string]: unknown }): void {
    this.inputList = this._parseInput(event['pathway'] as string | string[]);
    this.store.dispatch(
      AnalyteFromPathwayActions.fetchAnalytesFromPathways({
        pathways: this.inputList,
      }),
    );
  }
}
