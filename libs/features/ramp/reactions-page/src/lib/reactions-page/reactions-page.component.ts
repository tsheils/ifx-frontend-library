import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { select } from "@ngrx/store";
import { DataProperty } from "ncats-datatable";
import { PanelAccordionComponent } from "panel-accordion";
import { Analyte, RampResponse, Reaction } from "ramp";
import { RampCorePageComponent } from "ramp-core-page";
import { CommonReactionAnalyteActions, RampSelectors } from "ramp-store";
import { map } from "rxjs";

@Component({
  selector: 'lib-reactions-page',
  standalone: true,
  imports: [CommonModule, PanelAccordionComponent],
  templateUrl: './reactions-page.component.html',
  styleUrl: './reactions-page.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactionsPageComponent extends RampCorePageComponent implements OnInit {
  override dataColumns: DataProperty[] =  [
    new DataProperty({
      label: 'Analyte Id',
      field: 'inputAnalyte',
      sortable: true,
    }),
    new DataProperty({
      label: 'Analyte',
      field: 'inputCommonNames',
      sortable: true,
    }),
    new DataProperty({
      label: 'Relation',
      field: 'queryRelation',
      sortable: true,
    }),
    new DataProperty({
      label: 'Catalyzed By',
      field: 'rxnPartnerCommonName',
      sortable: true,
    }),
    new DataProperty({
      label: 'Catalyst IDs',
      field: 'rxnPartnerIdsString',
    }),
  ];

  constructor(
  ) {
    super()
  }

  ngOnInit() {
    console.log(this);
    this.store
      .pipe(
        select(RampSelectors.getCommonReactions),
        takeUntilDestroyed(this.destroyRef),
        map((res: RampResponse<Reaction> | undefined) => {
          if (res && res.data) {

            // map hmdb and rhea reactions
            this.dataMap.set('Reactions', {data: this._mapData(res.data), fields: this.dataColumns})
            const matches = Array.from(
              new Set(
                res.data.map((data) => data.inputAnalyte.toLocaleLowerCase()),
              ),
            );
            const noMatches = this.inputList.filter(
              (p: string) => !matches.includes(p.toLocaleLowerCase()),
            );
            this.resultsMap = {matches: matches, noMatches: noMatches, count: res.data.length, inputLength: this.inputList.length, fuzzy: true, inputType: 'analytes'};
          }
          if (res && res.dataframe) {
            this.dataframe = res.dataframe;
            if (this.downloadQueued) {
              this._downloadFile(
                this._toTSV(this.dataframe),
                'fetchCommonReactionAnalytes-download.tsv',
              );
              this.downloadQueued = false;
            }
          }
          if (res && res.query) {
            this.resultsMap.function = <string>res.query.functionCall;
          }
          //   this.pathwaysLoading = false;
          this.changeRef.markForCheck();
          console.log(this)
        }),
      )
      .subscribe();
  }

  override fetchData(event: { [key: string]: unknown }): void {
    console.log(event);
    this.inputList = this._parseInput(event['pathway'] as string | string[])
    this.store.dispatch(
      CommonReactionAnalyteActions.fetchCommonReactionAnalytes({ analytes: this.inputList }),
    );
  }

  override downloadData(event: {[key:string]: unknown}) {
    super.downloadData(event, 'fetchCommonReactionAnalytes-download.tsv');
  }
}
