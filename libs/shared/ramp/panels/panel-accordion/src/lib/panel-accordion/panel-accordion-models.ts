import {
  GraphData,
  QueryResultsData,
} from '@ncats-frontend-library/models/utils';
import { DataProperty } from '@ncats-frontend-library/models/utils';
import { QuestionBase } from 'ncats-form-question';

export class DataMap {
  data?: { [key: string]: DataProperty }[];
  fields!: DataProperty[];
  dataframe?: unknown[];
  fileName?: string;
  filters?: Map<string, QuestionBase<string>[]>;
}

export class VisualizationMap {
  type!: string;
  data?: GraphData;
}

export class AccordionPanelMap {
  visualizationMap: Map<string, VisualizationMap[]> = new Map<
    string,
    VisualizationMap[]
  >();
  dataMap: Map<string, DataMap> = new Map<string, DataMap>();
  overviewMap: QueryResultsData = {};
}
