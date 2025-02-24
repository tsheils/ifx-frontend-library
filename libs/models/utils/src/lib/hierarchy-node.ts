export interface HierarchyNode {
  term: string;
  parent?: string | undefined;
  count?: number;
  label?: string;
  htmlLabel?: string;
  children?: HierarchyNode[];
  color?: string;
}

