import { FlatTreeControl } from '@angular/cdk/tree';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
} from '@angular/material/tree';
import { HierarchyNode } from '@ncats-frontend-library/models/utils';

export class FlatHierarchyNode implements HierarchyNode {
  level!: number;
  expandable!: boolean;
  term!: string;
  parent?: string | undefined;
  count?: number;
  children?: HierarchyNode[];
}
@Component({
  selector: 'lib-tree-chart',
  imports: [CommonModule, MatIcon, MatIconButton, MatTreeModule],
  templateUrl: './tree-chart.component.html',
  styleUrl: './tree-chart.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeChartComponent {
  data = input<HierarchyNode[]>();
  dataSource = computed(() => this.data() as HierarchyNode[]);
  childrenAccessor = (node: HierarchyNode) => node.children ?? [];

  loaded = true;

  hasChild = (_: number, node: HierarchyNode) => !!node.children?.length;

  selectNode(node: FlatHierarchyNode) {
    console.log(node);
  }
}
