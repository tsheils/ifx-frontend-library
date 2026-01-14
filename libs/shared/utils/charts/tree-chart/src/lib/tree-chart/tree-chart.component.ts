import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { HierarchyNode } from 'utils-models';
import { FlatDiseaseNode } from 'rdas-tree';

/*export class FlatHierarchyNode implements HierarchyNode<unknown> {
  level!: number;
  expandable!: boolean;
  term!: string;
  parent?: string | undefined;
  count?: number;
  children?: HierarchyNode[];
}*/

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
  leafExpand = output<HierarchyNode>();

  childrenAccessor = (node: HierarchyNode) =>
    node.children ?? ([] as HierarchyNode[]);

  loaded = true;

  hasChild = (_: number, node: HierarchyNode) => !!node.count;

  selectNode(event: FlatDiseaseNode): void {
    this.loaded = false;
    this.leafExpand.emit(event);
    /* this.treeControl.toggle(event);
    if (this.treeControl.isExpanded(event)) {
      let r = this.treeControl.expansionModel.selected;
      if (r.length) {
        r = r.filter((node) => !(node.gardId === event.gardId));
        this.treeControl.expansionModel.clear();
        this.treeControl.expansionModel.select(...r);
      }
    } else {
      this.treeControl.expand(event);
    }*/
    //  this.loaded = true;
    //   this.changeRef.detectChanges();
  }
}
