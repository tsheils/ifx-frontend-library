import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { select } from '@ngrx/store';
import { DataProperty } from 'ncats-datatable';
import { PanelAccordionComponent } from 'panel-accordion';
import { CommonAnalyte, RampResponse, Reaction, ReactionClass } from 'ramp';
import {
  GraphData,
  GraphLink,
  GraphNode,
  HierarchyNode,
  UpsetData,
  UpsetPlot,
} from '@ncats-frontend-library/models/utils';
import { RampCorePageComponent } from 'ramp-core-page';
import { GRAPH_LEGEND, RampGraphLegendComponent } from 'ramp-graph-legend';
import {
  CommonReactionAnalyteActions,
  RampSelectors,
  ReactionClassesFromAnalytesActions,
  ReactionsFromAnalytesActions,
} from 'ramp-store';
import {
  RampSunburstTooltipComponent,
  SUNBURST_TOOLTIP,
} from 'ramp-sunburst-tooltip';
import { map } from 'rxjs';
import { SunburstChartService } from 'sunburst-chart';
import { ForceDirectedGraphService } from 'utils-force-directed-graph';

@Component({
  selector: 'lib-reactions-page',
  standalone: true,
  imports: [CommonModule, PanelAccordionComponent],
  providers: [
    {
      provide: SUNBURST_TOOLTIP,
      useValue: RampSunburstTooltipComponent,
    },
    {
      provide: GRAPH_LEGEND,
      useValue: RampGraphLegendComponent,
    },
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
  sunburstChartService = inject(SunburstChartService);
  forceDirectedGraphService = inject(ForceDirectedGraphService);
  _snackBar = inject(MatSnackBar);

  override dataColumns: DataProperty[] = [
    new DataProperty({
      label: 'Analyte Id',
      field: 'inputAnalyte',
      sortable: true,
    }),
    new DataProperty({
      label: 'Analyte',
      field: 'inputCommonName',
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
    /* new DataProperty({
      label: 'Catalyst IDs',
      field: 'rxnPartnerIdsString',
    }),*/
    new DataProperty({
      label: 'Source',
      field: 'source',
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

  nodeShapes = {
    met: 'circle',
    protein: 'rect',
    gene: 'rect',
  };

  edgeColors = {
    hmdb: '#ca1f7c',
    rhea: '#cc5501',
    both: '#0e8080',
  };

  edgeTypes = {
    met2gene: 'Metabolite to Gene',
    gene2met: 'Gene to Metabolite',
    met2protein: 'Metabolite to Protein',
    protein2met: 'Protein to Metabolite',
  };

  constructor() {
    super();
  }

  ngOnInit() {
    this.sunburstChartService.customComponent = SUNBURST_TOOLTIP;
    this.forceDirectedGraphService.customComponent = GRAPH_LEGEND;

    this.store
      .pipe(
        select(RampSelectors.getReactionResults),
        takeUntilDestroyed(this.destroyRef),
        map(
          (
            res:
              | {
                  reactions: RampResponse<Reaction> | undefined;
                  reactionClasses: RampResponse<ReactionClass> | undefined;
                  commonReactions: RampResponse<CommonAnalyte> | undefined;
                }
              | undefined,
          ) => {
            console.log(res);
            if (res?.reactions) {
              this._mapReactions(res.reactions);
            }
            if (res?.reactionClasses) {
              this._mapReactionClasses(res.reactionClasses);
            }

            if (res?.commonReactions && res?.commonReactions.data) {
              this._mapCommonAnalytes(res.commonReactions);
            }
          },
        ),
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

  private _mapReactions(res: RampResponse<Reaction>) {
    this.dataMap.set('Reactions', {
      data: this._mapData(res.data),
      fields: this.reactionColumns,
      dataframe: res.data,
      fileName: 'fetchReactionFromAnalytes-download.tsv',
    });
    const matches = Array.from(
      new Set(res.data.map((data) => data.metSourceId.toLocaleLowerCase())),
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

    if (res.plot) {
      console.log(JSON.stringify(res.plot));
      const upsetData = new UpsetPlot(this._mapToUpset(res.plot));
      console.log(upsetData);
      this.visualizationMap.set('Reaction Type Overlap', [
        {
          type: 'upset',
          data: { plot: upsetData } as GraphData,
        },
      ]);
    }
    this.loadedEvent.emit({ dataLoaded: true, resultsLoaded: true });

    if (res && res.query) {
      this.resultsMap.function = <string>res.query.functionCall;
    }
  }

  private _mapReactionClasses(res: RampResponse<ReactionClass>) {
    const ret = this._mapToHierarchy(
      res.data.filter((c) => c.reactionCount > 0),
    );
    //  console.log(JSON.stringify(ret))
    const graphData: GraphData = { values: ret } as GraphData;
    this.visualizationMap.set('Reaction Classes', [
      { type: 'sunburst', data: graphData },
      { type: 'tree', data: graphData },
    ]);
    // map hmdb and rhea reactions
    this.dataMap.set('Reaction Classes', {
      data: this._mapData(res.data),
      fields: this.reactionClassColumns,
      dataframe: res.data,
      fileName: 'fetchReactionClassesFromAnalytes-download.tsv',
    });

    this.loadedEvent.emit({ dataLoaded: true, resultsLoaded: true });
    this.sunburstChartService.nodeHovered.subscribe((value) => {
      if (value) {
        const term = value.node.term;
        const node = res!.data.filter((prop) => prop.rxnClass === term)[0];
        this.hoveredNode.set(node);
        this.sunburstChartService.reactionNode.set(node);
      } else {
        //  this.hoveredNode.set(value);
      }
    });
    this.changeRef.markForCheck();

    if (res && res.query) {
      // this.resultsMap.function = <string>res.query.functionCall;
    }
  }

  private _mapCommonAnalytes(res: RampResponse<CommonAnalyte>) {
    // map hmdb and rhea reactions
    const graphData = {
      graph: this._mapToGraph(res.data),
    } as GraphData;
    this.visualizationMap.set('Common Analyte Network', [
      { type: 'graph', data: graphData },
    ]);
    this.dataMap.set('Common Analytes', {
      data: this._mapData(res.data),
      fields: this.dataColumns,
      dataframe: res['dataframe'],
      fileName: 'fetchCommonReactionAnalytes-download.tsv',
    });
    const matches = Array.from(
      new Set(res.data.map((data) => data.inputAnalyte.toLocaleLowerCase())),
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

    if (res.query) {
      this.resultsMap.function = <string>res.query.functionCall;
    }

    this.forceDirectedGraphService.nodeClicked.subscribe((res) => {
      const allData = this.dataMap.get('Common Analytes')?.data;
      if (allData && res) {
        const filteredData = allData?.filter(
          (ca) =>
            ca['inputAnalyte'].value === res?.id ||
            ca['rxnPartnerCommonName'].value === res?.id,
        );
        this.forceDirectedGraphService.analyteData.set({
          data: filteredData,
          fields: this.dataColumns,
        });
      }
    });
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

  private _mapParent(map: Map<string, HierarchyNode>, nodes: HierarchyNode[]) {
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

  private _mapColor(node: ReactionClass) {
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

  private _mapToGraph(data: CommonAnalyte[]) {
    const sourceNodeMap: Map<string, GraphNode> = new Map<string, GraphNode>();
    const targetNodeMap: Map<string, GraphNode> = new Map<string, GraphNode>();
    let nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    data.forEach((analyte) => {
      let sourceNode = sourceNodeMap.get(analyte.inputAnalyte);
      let targetNode = targetNodeMap.get(analyte.rxnPartnerCommonName);
      const types = analyte.queryRelation.split(`2`);
      if (!sourceNode) {
        sourceNode = new GraphNode({
          id: analyte.inputAnalyte,
          label: analyte.inputCommonName,
          color: '#000000',
          extraClass: 'inputNode',
          shape: this.nodeShapes[types[0] as keyof typeof this.nodeShapes],
        });
        sourceNodeMap.set(analyte.inputAnalyte, sourceNode);
      }
      if (!targetNode) {
        targetNode = new GraphNode({
          id: analyte.rxnPartnerCommonName,
          label: analyte.rxnPartnerCommonName,
          color: '#e6f1f9',
          shape: this.nodeShapes[types[1] as keyof typeof this.nodeShapes],
        });
        targetNodeMap.set(analyte.rxnPartnerCommonName, targetNode);
      }
      links.push(
        new GraphLink({
          source: sourceNode.id,
          target: targetNode.id,
          label: analyte.source,
          id: analyte.source,
          color:
            this.edgeColors[
              analyte.source.toLocaleLowerCase() as keyof typeof this.edgeColors
            ],
          type: this.edgeTypes[
            analyte.queryRelation as keyof typeof this.edgeTypes
          ],
        }),
      );
    });
    nodes = [...sourceNodeMap.values(), ...targetNodeMap.values()];
    return { nodes: nodes, links: links };
  }

  private _mapToUpset(
    data: { id: string; sets: string[]; size: number }[],
  ): UpsetData[] {
    const upsetMap = this._ArrayToUpsetMap(data);
    const upsetData = this._mapToUpsetData(upsetMap);
    const distinctUpsetData = this._upsetArrayToDistictSetData(upsetData);
    console.log(distinctUpsetData);
    return distinctUpsetData;
  }

  private _ArrayToUpsetMap(
    data: { id: string; sets: string[]; size: number }[],
  ) {
    const setsMap: Map<string, string[]> = new Map<string, string[]>();
    data.forEach((level) => {
      level.sets.forEach((set) => {
        const levelSet = setsMap.get(set);
        if (!levelSet) {
          setsMap.set(set, [level.id]);
        } else {
          levelSet.push(level.id);
          setsMap.set(set, [...new Set(levelSet)]);
        }
      });
    });
    console.log(setsMap);
    return setsMap;
  }

  private _mapToUpsetData(upsetMap: Map<string, string[]>) {
    const retData: { id: string; sets: string[]; size: number }[] = [];

    [...upsetMap.entries()].forEach(([key, value]) => {
      retData.push({ id: key, sets: value, size: value.length });
    });
    return retData.sort((a, b) => b.size - a.size);
  }

  private _upsetArrayToDistictSetData(
    upsetArray: { id: string; sets: string[]; size: number }[],
  ) {
    const distinctMap: Map<string, string[]> = new Map<string, string[]>();
    upsetArray.forEach((set) => {
      const setString = set.sets.join(', ');
      const levelSet = distinctMap.get(setString);
      if (!levelSet) {
        distinctMap.set(setString, [set.id]);
      } else {
        levelSet.push(set.id);
        distinctMap.set(setString, [...new Set(levelSet)]);
      }
    });
    console.log(distinctMap);

    const retData: UpsetData[] = [];

    [...distinctMap.entries()].forEach(([key, value]) => {
      retData.push(
        new UpsetData({ id: key, sets: key.split(', '), size: value.length }),
      );
    });
    return retData.sort((a, b) => b.size - a.size);
    //  return this._mapToUpsetData(distinctMap);
  }
}
