export class QueryResultsData {
  function?: string[];
  matches?: string[];
  noMatches: string[] = [];
  count?: number;
  inputLength?: number;
  inputType?: string;
  fuzzy?: boolean;
}
