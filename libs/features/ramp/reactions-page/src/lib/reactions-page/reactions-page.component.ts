import { CdkCopyToClipboard, Clipboard } from '@angular/cdk/clipboard';
import { CdkDrag } from '@angular/cdk/drag-drop';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  CdkScrollable,
  OverlayModule,
  ScrollDispatcher,
} from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  ElementRef,
  inject,
  OnInit,
  signal,
  Signal,
  ViewChild,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { select } from '@ngrx/store';
import { DataProperty } from 'ncats-datatable';
import { PanelAccordionComponent } from 'panel-accordion';
import {
  Analyte,
  RampResponse,
  CommonAnalyte,
  Reaction,
  ReactionClass,
} from 'ramp';
import { HierarchyNode } from '@ncats-frontend-library/models/utils';
import { RampCorePageComponent } from 'ramp-core-page';
import {
  CommonReactionAnalyteActions,
  RampSelectors,
  ReactionClassesFromAnalytesActions,
  ReactionsFromAnalytesActions,
} from 'ramp-store';
import { map } from 'rxjs';
import { SunburstChartComponent, SunburstChartService } from 'sunburst-chart';

@Component({
  selector: 'lib-reactions-page',
  standalone: true,
  imports: [
    CommonModule,
    PanelAccordionComponent,
    CdkOverlayOrigin,
    CdkConnectedOverlay,
    OverlayModule,
    CdkDrag,
    MatIcon,
    MatIconButton,
    CdkCopyToClipboard,
  ],
  templateUrl: './reactions-page.component.html',
  styleUrl: './reactions-page.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactionsPageComponent
  extends RampCorePageComponent
  implements OnInit
{
  scrollable = viewChild(CdkScrollable);
  sunburstChartService = inject(SunburstChartService);
  _snackBar = inject(MatSnackBar);
  _clipboard = inject(Clipboard);
  scrollDispatcher = inject(ScrollDispatcher);
  // Signal<MyHeader|undefined>

  override dataColumns: DataProperty[] = [
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
  reactionColumns: DataProperty[] = [
    new DataProperty({
      label: 'Metabolite Id',
      field: 'metSourceId',
      sortable: true,
    }),
    new DataProperty({
      label: 'Metabolite Name',
      field: 'metName',
      sortable: true,
    }),
    new DataProperty({
      label: 'Reaction Id',
      field: 'reactionId',
      sortable: true,
    }),
    new DataProperty({
      label: 'Metabolite Count',
      field: 'metHitCount',
      sortable: true,
    }),
    new DataProperty({
      label: 'Label',
      field: 'label',
      sortable: true,
    }),
    new DataProperty({
      label: 'Direction',
      field: 'direction',
      sortable: true,
    }),
    new DataProperty({
      label: 'Cofactor',
      field: 'isCofactor',
      sortable: true,
    }),
    new DataProperty({
      label: 'Transport',
      field: 'isTransport',
      sortable: true,
    }),
  ];
  reactionClassColumns: DataProperty[] = [
    new DataProperty({
      label: 'Reaction Class',
      field: 'rxnClass',
      sortable: true,
    }),
    new DataProperty({
      label: 'EC Number',
      field: 'ecNumber',
      sortable: true,
    }),
    new DataProperty({
      label: 'Hierarchy',
      field: 'rxnClassHierarcy',
      sortable: true,
    }),
    new DataProperty({
      label: 'Metabolite Count',
      field: 'metCountAverage',
      sortable: false,
    }),
    new DataProperty({
      label: 'Protein Count',
      field: 'proteinCountAverage',
      sortable: false,
    }),
    new DataProperty({
      label: 'Total Reaction Count',
      field: 'totalReactionAverage',
      sortable: false,
    }),
  ];
  hoveredNode = signal<ReactionClass | undefined>(undefined);
  textLabel = signal<string | undefined>(undefined);

  constructor() {
    super();
  }

  ngOnInit() {
    this.store
      .pipe(
        select(RampSelectors.getCommonReactions),
        takeUntilDestroyed(this.destroyRef),
        map((res: RampResponse<CommonAnalyte> | undefined) => {
          if (res && res.data) {
            // map hmdb and rhea reactions
            this.dataMap.set('Common Analytes', {
              data: this._mapData(res.data),
              fields: this.dataColumns,
            });
            const matches = Array.from(
              new Set(
                res.data.map((data) => data.inputAnalyte.toLocaleLowerCase()),
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
              inputType: 'analytes',
            };
            this.loadedEvent.emit({ dataLoaded: true, resultsLoaded: true });
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
        }),
      )
      .subscribe();

    this.store
      .pipe(
        select(RampSelectors.getReactions),
        takeUntilDestroyed(this.destroyRef),
        map((res: RampResponse<Reaction> | undefined) => {
          if (res && res.data) {
            // map hmdb and rhea reactions
            this.dataMap.set('Reactions', {
              data: this._mapData(res.data),
              fields: this.reactionColumns,
            });
            const matches = Array.from(
              new Set(
                res.data.map((data) => data.metSourceId.toLocaleLowerCase()),
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
              inputType: 'analytes',
            };
            this.loadedEvent.emit({ dataLoaded: true, resultsLoaded: true });
          }
          if (res && res.dataframe) {
            this.dataframe = res.dataframe;
            if (this.downloadQueued) {
              this._downloadFile(
                this._toTSV(this.dataframe),
                'fetchReactionFromAnalytes-download.tsv',
              );
              this.downloadQueued = false;
            }
          }
          if (res && res.query) {
            this.resultsMap.function = <string>res.query.functionCall;
          }
          //   this.pathwaysLoading = false;
          this.changeRef.markForCheck();
        }),
      )
      .subscribe();

    this.store
      .pipe(
        select(RampSelectors.getReactionClasses),
        takeUntilDestroyed(this.destroyRef),
        map((res: RampResponse<ReactionClass> | undefined) => {
          if (res && res.data) {
            const ret = this._mapToHierarchy(res.data);
            this.visualizationMap.set('Reaction Classes', [
              { type: 'sunburst', data: { values: ret } },
              { type: 'tree', data: { values: ret } },
            ]);
            // map hmdb and rhea reactions
            this.dataMap.set('Reaction Classes', {
              data: this._mapData(res.data),
              fields: this.reactionClassColumns,
            });
            /* const matches = Array.from(
              new Set(
                res.data.map((data) => data.rxnClass.toLocaleLowerCase()),
              ),
            );
            const noMatches = this.inputList.filter(
              (p: string) => !matches.includes(p.toLocaleLowerCase()),
            );*/
            /*  this.resultsMap = {
            //  matches: matches,
            //  noMatches: noMatches,
              count: res.data.length,
              inputLength: this.inputList.length,
            //  fuzzy: true,
              inputType: 'analytes',
            };*/
            this.loadedEvent.emit({ dataLoaded: true, resultsLoaded: true });
            this.sunburstChartService.nodeHovered.subscribe((value) => {
              if (value) {
                const term = value.node.term;
                const node = res!.data.filter(
                  (prop) => prop.rxnClass === term,
                )[0];
                this.hoveredNode.set(node);
              } else {
                //  this.hoveredNode.set(value);
              }
            });
          }
          if (res && res.dataframe) {
            this.dataframe = res.dataframe;
            if (this.downloadQueued) {
              this._downloadFile(
                this._toTSV(this.dataframe),
                'fetchReactionClassesFromAnalytes-download.tsv',
              );
              this.downloadQueued = false;
            }
          }
          if (res && res.query) {
            // this.resultsMap.function = <string>res.query.functionCall;
          }
          //   this.pathwaysLoading = false;

          this.changeRef.markForCheck();
        }),
      )
      .subscribe();
  }

  override fetchData(event: { [key: string]: unknown }): void {
    this.inputList = this._parseInput(event['analytes'] as string | string[]);
    this.store.dispatch(
      CommonReactionAnalyteActions.fetchCommonReactionAnalytes({
        analytes: this.inputList,
      }),
    );
    this.store.dispatch(
      ReactionsFromAnalytesActions.fetchReactionsFromAnalytes({
        analytes: this.inputList,
      }),
    );
    this.store.dispatch(
      ReactionClassesFromAnalytesActions.fetchReactionClassesFromAnalytes({
        analytes: this.inputList,
      }),
    );
  }

  override downloadData(event: { [key: string]: unknown }) {
    super.downloadData(event, 'fetchCommonReactionAnalytes-download.tsv');
  }

  private _mapToHierarchy(classes: ReactionClass[]): HierarchyNode[] {
    let hierarchyArr: HierarchyNode[] = [];
    const sortedClasses: Map<number, HierarchyNode[]> = new Map<
      number,
      HierarchyNode[]
    >();

    classes.forEach((reactionClass) => {
      const level = sortedClasses.get(
        reactionClass.classLevel,
      ) as HierarchyNode[];
      const rxnClass = {
        term: reactionClass.rxnClass,
        count: reactionClass.reactionCount,
        color: this._mapColor(reactionClass),
        parent:
          reactionClass.hierarchyArray.length > 1
            ? reactionClass.hierarchyArray[reactionClass.classLevel - 2]
            : undefined,
      } as HierarchyNode;
      if (level) {
        level.push(rxnClass);
        sortedClasses.set(reactionClass.classLevel, level);
      } else {
        sortedClasses.set(reactionClass.classLevel, [rxnClass]);
      }
    });
    if ([...sortedClasses.keys()].length - 1 > 0) {
      [...sortedClasses.keys()].reverse().forEach((key) => {
        if (key - 1 > 0) {
          const bottom = sortedClasses.get(key) as HierarchyNode[];
          const next = sortedClasses.get(key - 1) as HierarchyNode[];
          const nextMap: Map<string, HierarchyNode> = new Map<
            string,
            HierarchyNode
          >();
          next.forEach((node) => {
            nextMap.set(<string>node.term, node as HierarchyNode);
          });
          const retMap = this._mapParent(nextMap, bottom);
          hierarchyArr = [...retMap.values()];
        }
      });
    }
    return hierarchyArr;
  }

  _mapParent(map: Map<string, HierarchyNode>, nodes: HierarchyNode[]) {
    nodes.forEach((node) => {
      const parent = map.get(node.parent as string) as HierarchyNode;
      if (parent.children) {
        parent.children.push(node);
      } else {
        parent.children = [node];
      }
      map.set(parent.term, parent);
    });
    return map;
  }

  _mapColor(node: ReactionClass) {
    const index = ((<unknown>node.ecNumber[0]) as number) - 1;
    const level = node.classLevel;
    const colors = [
      ['#6E899CCC'],
      ['#DC587DCC'],
      ['#BC7196CC'],
      ['#479B55CC'],
      ['#FE00CECC'],
      ['#B68E00CC'],
      ['#FC6955CC'],
    ];

    return colors[index][0];
  }

  copyData() {
    let retString = `
    ${this.hoveredNode()?.rxnClass}
    EC Number: ${this.hoveredNode()?.ecNumber}
    `;
    if (this.hoveredNode()?.metCount) {
      retString =
        retString +
        `${this.hoveredNode()?.metCount} input metabolites out of ${this.hoveredNode()?.totalMetsInRxnClass} total\r\n`;
    }
    if (this.hoveredNode()?.proteinCount) {
      retString =
        retString +
        `${this.hoveredNode()?.proteinCount} input proteins out of ${this.hoveredNode()?.totalProteinsInRxnClass} total\r\n`;
    }
    if (this.hoveredNode()?.reactionCount) {
      retString =
        retString +
        `${this.hoveredNode()?.reactionCount} reactions hit out of ${this.hoveredNode()?.totalRxnsInClass} total\r\n`;
    }

    const pending = this._clipboard.beginCopy(retString);
    let remainingAttempts = 3;
    const attempt = () => {
      const result = pending.copy();
      if (!result && --remainingAttempts) {
        setTimeout(attempt);
      } else {
        this._snackBar.open('Data copied', '', {
          duration: 3000,
        });
        pending.destroy();
      }
    };
    attempt();
  }
}
