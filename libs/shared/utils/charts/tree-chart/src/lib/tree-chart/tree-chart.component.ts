import { FlatTreeControl, TreeControl } from '@angular/cdk/tree';
import { Component, effect, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {
  MatTree,
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeNode,
  MatTreeNodeDef,
  MatTreeNodePadding,
  MatTreeNodeToggle,
} from '@angular/material/tree';
import { HierarchyNode } from '@ncats-frontend-library/models/utils';
import { LoadingSpinnerComponent } from '@ncats-frontend-library/shared/utils/loading-spinner';

/** Flat tree item node with expandable and level information */
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
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    MatCard,
    MatIcon,
    MatIconButton,
    MatTree,
    MatTreeNode,
    MatTreeNodeDef,
    MatTreeNodePadding,
    MatTreeNodeToggle,
  ],
  templateUrl: './tree-chart.component.html',
  styleUrl: './tree-chart.component.scss',
})
export class TreeChartComponent {
  data = input<HierarchyNode[]>();
  leafExpand = output<HierarchyNode>();

  treeControl = new FlatTreeControl<FlatHierarchyNode>(
    (node) => node.level,
    (node) => node.expandable,
  );

  private _transformer = (node: HierarchyNode, level: number) => {
    const flatNode = (<unknown>node) as FlatHierarchyNode;
    flatNode.expandable = (node.children && node.children.length > 0) || false;
    flatNode.level = level;
    return flatNode;
  };

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children || [],
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  loaded = true;

  private _setData = effect(() => {
    this.dataSource.data = this.data() as HierarchyNode[];
  });

  hasChild = (_: number, node: HierarchyNode) => !!node.children?.length;

  selectNode(node: FlatHierarchyNode) {
    console.log(node);
  }
}
