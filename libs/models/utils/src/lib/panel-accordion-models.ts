import { QuestionBase } from 'ncats-form-question';
import { DataProperty } from './data-property';
import { GraphData } from './graph-data';

export class DataMap {
  data?: { [key: string]: DataProperty }[];
  fields!: DataProperty[];
  dataframe?: unknown[];
  fileName?: string;
  filters?: Map<string, QuestionBase<string>[]>;
  loaded? = false;
}

export class VisualizationMap {
  type!: string;
  data?: GraphData;
  loaded? = false;
}
