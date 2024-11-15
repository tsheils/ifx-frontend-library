import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import {
  FilterCategory,
  Filter,
  DataProperty,
} from '@ncats-frontend-library/models/utils';
import {
  Analyte,
  ChemicalEnrichment,
  Classes,
  CommonAnalyte,
  EntityCount,
  FisherResult,
  FishersDataframe,
  Metabolite,
  Ontology,
  Pathway,
  Properties,
  RampAPIResponse,
  RampChemicalEnrichmentAPIResponse,
  RampChemicalEnrichmentResponse,
  RampDataGeneric,
  RampPathwayEnrichmentAPIResponse,
  RampPathwayEnrichmentResponse,
  RampReactionAPIResponse,
  RampResponse,
  Reaction,
  ReactionClass,
  SourceVersion,
} from 'ramp';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const HTTP_OPTIONS = {
  headers: new HttpHeaders(),
  responseType: 'blob' as 'json',
};

const HTTP_TEXT_OPTIONS = {
  headers: new HttpHeaders(),
  responseType: 'text' as const,
};

@Injectable({
  providedIn: 'root',
})
export class RampService {
  private url!: string;
  private renderUrl!: string;

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private dom: Document,
  ) {}

  loadAboutData() {
    return forkJoin({
      sourceVersions: this.fetchSourceVersions(),
      entityCounts: this.fetchEntityCounts(),
      metaboliteIntersects: this.fetchMetaboliteIntersects(),
      geneIntersects: this.fetchGeneIntersects(),
      supportedIds: this.fetchSupportedIds(),
      databaseUrl: this.fetchDatabaseUrl(),
    });
  }

  fetchApi(url: string): Observable<{
    paths: { [key: string]: { post?: { [key: string]: unknown } | undefined } };
  }> {
    return this.http
      .get<{
        paths: {
          [key: string]: { post?: { [key: string]: unknown } | undefined };
        };
      }>(url)
      .pipe(
        map(
          (response: {
            paths: {
              [key: string]: { post?: { [key: string]: unknown } | undefined };
            };
          }) => {
            return response;
          },
        ),
      );
  }

  fetchSourceVersions(): Observable<SourceVersion[]> {
    return this.http
      .get<{ data: SourceVersion[] }>(`${this.url}source-versions`)
      .pipe(map((response) => response.data));
  }

  fetchEntityCounts() {
    return this.http
      .get<{ data: { [p: string]: string }[] }>(`${this.url}entity-counts`) // ,{responseType: 'text'})
      .pipe(
        map((response: { data: { [p: string]: string }[] }) =>
          response.data.map(
            (obj: { [p: string]: string }) => new EntityCount(obj),
          ),
        ),
        catchError(this.handleError('fetchEntityCounts', [])),
      );
  }

  fetchSupportedIds(): Observable<
    { analyteType: string; idTypes: string[] }[]
  > {
    return this.http
      .get<{
        data: { analyteType: string; idTypes: string[] }[];
      }>(`${this.url}id-types`)
      .pipe(
        map((response) => {
          return response.data;
        }),
      );
  }

  fetchDatabaseUrl() {
    return this.http
      .get<{ data: string }>(`${this.url}current-db-file-url`)
      .pipe(map((response: { data: string }) => response.data));
  }

  fetchMetaboliteIntersects() {
    return this.fetchAnalyteIntersects('metabolites');
  }

  fetchGeneIntersects() {
    return this.fetchAnalyteIntersects('genes');
  }

  fetchAnalyteIntersects(param: string) {
    return this.http
      .get<{
        data: { id: string; sets: string[]; size: number }[];
      }>(
        `${this.url}analyte-intersects?analytetype=${param}&query_scope=global`,
      )
      .pipe(
        map(
          (response: {
            data: { id: string; sets: string[]; size: number }[];
          }) => response.data,
        ),
        catchError(this.handleError('fetchAnalyteIntersects', [])),
      );
  }

  fetchPathwaysFromAnalytes(
    analytes: string[],
  ): Observable<RampResponse<Pathway>> {
    const options = {
      analytes: analytes,
    };
    return this.http
      .post<
        RampAPIResponse<Pathway>
      >(`${this.url}pathways-from-analytes`, options)
      .pipe(
        map((response: RampAPIResponse<Pathway>) => {
          const pathwayList: Pathway[] = response.data.map(
            (obj: Pathway) => new Pathway(obj),
          );
          return this._makeRampResponse(response, pathwayList);
        }),
      );
  }

  fetchAnalytesFromPathways(action: {
    pathways: string[];
    analyteType: string;
  }): Observable<RampResponse<Analyte>> {
    const options = {
      pathway: action.pathways,
      analyteType: action.analyteType,
    };
    return this.http
      .post<
        RampAPIResponse<Analyte>
      >(`${this.url}analytes-from-pathways`, options)
      .pipe(
        map((response: RampAPIResponse<Analyte>) => {
          const analyteList = response.data.map(
            (obj: Partial<Analyte>) => new Analyte(obj),
          );
          return this._makeRampResponse(response, analyteList);
        }),
      );
  }

  fetchOntologiesFromMetabolites(
    analytes: string[],
  ): Observable<RampResponse<Ontology>> {
    const options = {
      metabolites: analytes,
    };
    return this.http
      .post<
        RampAPIResponse<Ontology>
      >(`${this.url}ontologies-from-metabolites`, options)
      .pipe(
        map((response: RampAPIResponse<Ontology>) => {
          const ontologyList = response.data.map(
            (obj: unknown) => new Ontology(obj as { [key: string]: unknown }),
          );
          return this._makeRampResponse(response, ontologyList);
        }),
      );
  }

  fetchMetabolitesFromOntologies(
    ontologies: string[],
  ): Observable<RampResponse<Metabolite>> {
    const options = {
      ontology: ontologies,
    };
    return this.http
      .post<
        RampAPIResponse<Metabolite>
      >(`${this.url}metabolites-from-ontologies`, options)
      .pipe(
        map((response: RampAPIResponse<Metabolite>) => {
          const metaboliteList = response.data.map(
            (obj: Partial<Metabolite>) => new Metabolite(obj),
          );
          return this._makeRampResponse(response, metaboliteList);
        }),
      );
  }

  fetchOntologies(): Observable<{ data: FilterCategory[] }> {
    return this.http
      .get<{
        uniq_ontology_types: string[];
        data: Ontology[];
      }>(`${this.url}ontology-types`)
      .pipe(
        map((response: { uniq_ontology_types: string[]; data: Ontology[] }) => {
          const ontoMap: Map<string, FilterCategory> = new Map<
            string,
            FilterCategory
          >();
          response.uniq_ontology_types.forEach((onto: string) =>
            ontoMap.set(onto, new FilterCategory({ label: onto, values: [] })),
          );
          response.data.forEach((ontoType: Ontology) => {
            let cl: FilterCategory | undefined = ontoMap.get(
              ontoType.HMDBOntologyType,
            );
            if (cl) {
              cl.values.push(
                new Filter({
                  label: ontoType.commonName,
                  term: ontoType.commonName,
                  value: ontoType.commonName,
                  count: ontoType.metCount,
                }),
              );
            } else {
              cl = new FilterCategory({
                label: ontoType.HMDBOntologyType,
                values: [
                  new Filter({
                    label: ontoType.commonName,
                    term: ontoType.commonName,
                    value: ontoType.commonName,
                    count: ontoType.metCount,
                  }),
                ],
              });
            }
            ontoMap.set(ontoType.HMDBOntologyType, cl);
          });
          return {
            data: [...ontoMap.values()].map((fc) => new FilterCategory(fc)),
          };
        }),
      );
  }

  fetchMetabolitesFromOntologiesFile(ontologies: string[], format: string) {
    const params = {
      ontology: ontologies.join(','),
      format: format,
    };
    this.http
      .post<
        string[]
      >(`${this.url}metabolites-from-ontologies`, params, HTTP_OPTIONS)
      .subscribe((response: unknown) => {
        this._downloadFile(
          response as Blob,
          'fetchMetabolitesFromOntologies-download.tsv',
        );
      });
  }

  fetchChemicalClass(
    metabolites: string[],
    background?: string,
    backgroundFile?: File,
  ): Observable<RampResponse<Classes>> {
    const formData = new FormData();
    formData.set('metabolites', JSON.stringify(metabolites));
    if (background) {
      formData.set('background', JSON.stringify([background]));
    }
    if (backgroundFile) {
      formData.set('backgroundFile', backgroundFile, backgroundFile.name);
    }
    return this.http
      .post<RampAPIResponse<Classes>>(`${this.url}chemical-classes`, formData)
      .pipe(
        map((response: RampAPIResponse<Classes>) => {
          const tempResponse: { [key: string]: unknown }[] = (<unknown>(
            response.data
          )) as { [key: string]: unknown }[];
          let metClasses: Classes[] = [];
          const metabMap: Map<string, { [key: string]: unknown }> = new Map<
            string,
            { [key: string]: unknown }
          >();
          if (response.data && response.data.length) {
            tempResponse.forEach((chClass: { [key: string]: unknown }) => {
              let cl = metabMap.get(<string>chClass['sourceId']);
              if (cl) {
                const clArr: { [key: string]: unknown }[] = cl[
                  'levels'
                ] as Array<{ [key: string]: unknown }>;
                clArr.push(chClass);
                cl['levels'] = clArr;
              } else {
                cl = { sourceId: chClass['sourceId'], levels: [chClass] };
              }
              metabMap.set(<string>chClass['sourceId'], cl);
            });
            metClasses = [...metabMap.values()].map(
              (obj: { [key: string]: unknown }) => new Classes(obj),
            );
          }
          return this._makeRampResponse(response, metClasses);
        }),
      );
  }

  fetchPropertiesFromMetabolites(
    metabolites: string[],
  ): Observable<RampResponse<Properties>> {
    const options = {
      metabolites: metabolites,
    };
    return this.http
      .post<
        RampAPIResponse<Properties>
      >(`${this.url}chemical-properties`, options)
      .pipe(
        map((response: RampAPIResponse<Properties>) => {
          const propertyList = response.data.map(
            (obj: Partial<Properties>) => new Properties(obj),
          );
          const propertyListAsDataProperty = this._makeRampResponse(
            response,
            propertyList,
          );
          propertyListAsDataProperty?.dataAsDataProperty?.map((prop) => {
            prop['imageUrl'].url =
              `${this.renderUrl}(${encodeURIComponent(prop['iso_smiles'].value)})?size=150`;
            prop['imageUrl'].label = prop['common_name'].value;
            return prop;
          });
          return propertyListAsDataProperty;
        }),
      );
  }

  fetchCommonReactionAnalytes(
    analytes: string[],
  ): Observable<RampResponse<CommonAnalyte>> {
    const options = {
      analytes: analytes,
    };
    return this.http
      .post<
        RampAPIResponse<CommonAnalyte>
      >(`${this.url}common-reaction-analytes`, options)
      .pipe(
        map((response: RampAPIResponse<CommonAnalyte>) => {
          const commonAnalyteList = response.data.map(
            (obj: unknown) =>
              new CommonAnalyte(obj as { [key: string]: unknown }),
          );
          return this._makeRampResponse(response, commonAnalyteList);
        }),
      );
  }

  fetchReactionsFromAnalytes(
    analytes: string[],
    onlyHumanMets?: boolean,
    humanProtein?: boolean,
    includeTransportRxns?: boolean,
    rxnDirs?: string,
    includeRxnURLs?: boolean,
  ): Observable<RampResponse<Reaction>> {
    const options = {
      analytes: analytes,
      onlyHumanMets: onlyHumanMets,
      humanProtein: humanProtein,
      includeTransportRxns: includeTransportRxns,
      rxnDirs: rxnDirs,
      includeRxnURLs: includeRxnURLs,
    };
    return this.http
      .post<{
        data: {
          met2rxn: Reaction[];
          prot2rxn: Reaction[];
          metProteinCommonReactions: Reaction[];
        };
        function_call: string[];
        plot: { [key: string]: string[] };
      }>(`${this.url}reactions-from-analytes`, options)
      .pipe(
        map((response: RampReactionAPIResponse) => {
          const reactionList = response.data.met2rxn.map(
            (obj: unknown) => new Reaction(obj as Partial<Reaction>),
          );
          const plot = Object.keys(response.plot).map((level: string) => {
            const t = response.plot[level as keyof typeof response.plot];
            let r = [];
            if (Object.is(t, {})) {
              r = Array.from([]);
            } else {
              r = Array.from(t as []);
            }
            return {
              id: level,
              sets: [...new Set(r)],
              size: [...r].length,
            };
          });
          return this._makeRampResponse(
            {
              function_call: response.function_call,
              data: reactionList,
            } as RampAPIResponse<Reaction>,
            reactionList,
            plot,
          );
        }),
      );
  }

  fetchReactionClassesFromAnalytes(
    analytes: string[],
    multiRxnParticipantCount?: number,
    humanProtein?: boolean,
    concatResults?: boolean,
    includeReactionIDs?: string,
    useIdMapping?: boolean,
  ): Observable<RampResponse<ReactionClass>> {
    const options = {
      analytes: analytes,
      multiRxnParticipantCount: multiRxnParticipantCount,
      humanProtein: humanProtein,
      concatResults: concatResults,
      includeReactionIDs: includeReactionIDs,
      useIdMapping: useIdMapping,
    };
    return this.http
      .post<{
        data: ReactionClass[];
        function_call: string[];
      }>(`${this.url}reaction-classes-from-analytes`, options)
      .pipe(
        map((response: RampAPIResponse<ReactionClass>) => {
          const reactionClassList = response.data.map(
            (obj: unknown) => new ReactionClass(obj as Partial<ReactionClass>),
          );
          return this._makeRampResponse(response, reactionClassList);
        }),
      );
  }

  fetchEnrichmentFromMetabolites(
    metabolites: string[],
    background?: string,
    backgroundFile?: File,
  ): Observable<RampChemicalEnrichmentResponse> {
    const formData = new FormData();
    formData.set('metabolites', JSON.stringify(metabolites));
    if (background) {
      formData.set('background', JSON.stringify([background]));
    }
    if (backgroundFile) {
      formData.set('backgroundFile', backgroundFile, backgroundFile.name);
    }
    return this.http
      .post<RampChemicalEnrichmentAPIResponse>(
        `${this.url}chemical-enrichment`,
        formData,
      )
      .pipe(
        map((response: RampChemicalEnrichmentAPIResponse) => {
          const retList: ChemicalEnrichment[] = [];
          const responseClone = response.data;
          //  delete responseClone.result_type;
          [...Object.values(responseClone)].forEach((val: unknown[]) => {
            if (typeof val[0] !== 'string') {
              val.forEach((cc: unknown) => {
                retList.push(
                  new ChemicalEnrichment(cc as { [key: string]: unknown }),
                );
              });
            }
          });
          const dataAsDataProperties = this._mapDataToDataProperty(retList);
          return {
            data: response,
            enriched_chemical_class_list: retList,
            dataAsDataProperty: dataAsDataProperties,
          } as RampChemicalEnrichmentResponse;
        }),
      );
  }

  filterMetaboliteEnrichment(
    dataframe: RampChemicalEnrichmentResponse,
    pValType?: string,
    pValCutoff?: number,
  ) {
    return this.http
      .post<RampChemicalEnrichmentAPIResponse>(
        `${this.url}filter-fisher-test-results`,
        {
          fishers_results: dataframe.data,
          pValType: pValType,
          pValCutoff: pValCutoff,
        },
      )
      .pipe(
        map((response: RampChemicalEnrichmentAPIResponse) => {
          const retList: ChemicalEnrichment[] = [];
          [...Object.values(response.data)].forEach((val: unknown[]) => {
            return val.forEach((cc: unknown) => {
              if (cc != 'chemical_class_enrichment')
                retList.push(
                  new ChemicalEnrichment(cc as { [key: string]: unknown }),
                );
            });
          });
          const dataAsDataProperties = this._mapDataToDataProperty(retList);
          return {
            data: response.data,
            enriched_chemical_class_list: retList,
            dataAsDataProperty: dataAsDataProperties,
          } as RampChemicalEnrichmentResponse;
        }),
      );
  }

  fetchEnrichmentFromMetabolitesFile(data: ChemicalEnrichment[]) {
    this._downloadFile(
      this._makeBlob(this._toTSV(data)),
      'fetchEnrichmentFromMetabolites-download.tsv',
    );
  }

  fetchEnrichmentFromPathways(
    analytes: string[],
    background?: string,
    backgroundFile?: File,
  ): Observable<RampPathwayEnrichmentResponse> {
    const formData = new FormData();
    formData.set('analytes', JSON.stringify(analytes));
    if (background) {
      formData.set('background', JSON.stringify([background]));
    }
    if (backgroundFile) {
      formData.set('file', backgroundFile, backgroundFile.name);
    }
    return this.http
      .post<RampPathwayEnrichmentAPIResponse>(
        `${this.url}combined-fisher-test`,
        formData,
      )
      .pipe(
        map((response: RampPathwayEnrichmentAPIResponse) =>
          this._makeRampPathwayEnrichmentResponse(response),
        ),
      );
  }

  filterPathwayEnrichment(
    dataframe: FishersDataframe,
    pValType?: string,
    pValCutoff?: number,
  ): Observable<RampPathwayEnrichmentResponse> {
    return this.http
      .post<RampPathwayEnrichmentAPIResponse>(
        `${this.url}filter-fisher-test-results`,
        {
          fishers_results: dataframe,
          pValType: pValType,
          pValCutoff: pValCutoff,
        },
      )
      .pipe(
        map((response: RampPathwayEnrichmentAPIResponse) =>
          this._makeRampPathwayEnrichmentResponse(response),
        ),
      );
  }

  getClusteredData(
    dataframe: FishersDataframe,
    percAnalyteOverlap?: number,
    minPathwayToCluster?: number,
    percPathwayOverlap?: number,
  ): Observable<{ data: RampPathwayEnrichmentResponse; plot: string }> {
    return forkJoin({
      data: this.clusterPathwayEnrichment(
        dataframe,
        percAnalyteOverlap,
        minPathwayToCluster,
        percPathwayOverlap,
      ),
      plot: this.fetchClusterPlot(
        dataframe,
        percAnalyteOverlap,
        minPathwayToCluster,
        percPathwayOverlap,
      ),
    });
  }

  clusterPathwayEnrichment(
    dataframe: FishersDataframe,
    percAnalyteOverlap?: number,
    minPathwayToCluster?: number,
    percPathwayOverlap?: number,
  ): Observable<RampPathwayEnrichmentResponse> {
    return this.http
      .post<RampPathwayEnrichmentAPIResponse>(
        `${this.url}cluster-fisher-test-results`,
        {
          fishers_results: dataframe,
          percAnalyteOverlap: percAnalyteOverlap,
          minPathwayToCluster: minPathwayToCluster,
          percPathwayOverlap: percPathwayOverlap,
        },
      )
      .pipe(
        map((response: RampPathwayEnrichmentAPIResponse) =>
          this._makeRampPathwayEnrichmentResponse(response),
        ),
      );
  }

  fetchClusterPlot(
    dataframe: FishersDataframe,
    percAnalyteOverlap?: number,
    minPathwayToCluster?: number,
    percPathwayOverlap?: number,
  ): Observable<string> {
    if (!dataframe.fishresults || dataframe.fishresults.length >= 105) {
      return of(<string>'');
    } else {
      const body = {
        fishers_results: dataframe,
        textSize: 8,
        percAnalyteOverlap: percAnalyteOverlap,
        minPathwayToCluster: minPathwayToCluster,
        percPathwayOverlap: percPathwayOverlap,
        filename: Date.now() + '.svg',
      };
      return this.http
        .post(`${this.url}cluster-plot`, body, HTTP_TEXT_OPTIONS)
        .pipe(
          map((response: unknown) => {
            return <string>response;
          }),
        );
    }
  }

  fetchClusterImageFile(data: string) {
    this._downloadFile(
      this._makeBlob([data], 'image/svg+xml'),
      'fetchClusterImageFile-download.svg',
    );
  }

  private _mapDataToDataProperty<T extends RampDataGeneric>(
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

  _makeRampResponse<T extends RampDataGeneric>(
    apiResponse: RampAPIResponse<T>,
    dataList: T[],
    plot?: { id: string; sets: string[]; size: number }[],
  ) {
    return {
      data: dataList,
      query: {
        functionCall: apiResponse.function_call[0],
        numFoundIds: apiResponse.numFoundIds ? apiResponse.numFoundIds[0] : 0,
      },
      plot: plot,
      dataAsDataProperty: this._mapDataToDataProperty(dataList),
    } as RampResponse<T>;
  }

  _makeRampPathwayEnrichmentResponse(
    apiResponse: RampPathwayEnrichmentAPIResponse,
  ) {
    const enrichedPathwayList = apiResponse.data.fishresults.map(
      (obj: Partial<FisherResult>) => new FisherResult(obj),
    );
    return {
      data: enrichedPathwayList,
      combinedFishersDataframe: apiResponse.data as FishersDataframe,
      filteredFishersDataframe: apiResponse.data as FishersDataframe,
      query: {
        functionCall: apiResponse.function_call
          ? apiResponse.function_call[0]
          : undefined,
      },
      dataAsDataProperty: this._mapDataToDataProperty(enrichedPathwayList),
    } as RampPathwayEnrichmentResponse;
  }

  private _toTSV<T extends RampDataGeneric>(data: unknown[]): string[] {
    const headings: string = Object.keys(data[0] as string[]).join('\t');
    const rows: string[] = <string[]>(<unknown>data
      .reduce(
        (acc: string[], c: unknown) => {
          const vals = Object.values(c as T);
          const row = vals.join('\t');
          return acc.concat(row);
        },
        [headings],
      )
      .join('\n'));
    return rows;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: ErrorEvent): Observable<T> => {
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  _setUrl(url: string): void {
    this.url = url;
  }

  _setRendererUrl(url: string): void {
    this.renderUrl = url;
  }

  private _makeBlob(data: string[], type = 'text/tsv'): Blob {
    return new Blob([...data], { type: type });
  }

  private _downloadFile(blob: Blob, name: string) {
    const link = this.dom.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${name}`);
      link.style.visibility = 'hidden';
      this.dom.body.appendChild(link);
      link.click();
      this.dom.body.removeChild(link);
    }
  }
}
