import { FlatTreeControl } from '@angular/cdk/tree';
import {
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
} from '@angular/material/tree';
import { Router } from '@angular/router';
import { Disease, DiseaseNode } from '@ncats-frontend-library/models/rdas';
import { LoadingSpinnerComponent } from '@ncats-frontend-library/shared/utils/loading-spinner';

export class FlatDiseaseNode extends DiseaseNode {
  level!: number;
  expandable!: boolean;
}

@Component({
  selector: 'ncats-frontend-library-rdas-tree',
  imports: [
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './rdas-tree.component.html',
  standalone: true,
  styleUrls: ['./rdas-tree.component.scss'],
})
export class RdasTreeComponent {
  private changeRef = inject(ChangeDetectorRef);
  private router = inject(Router);
  data = input<Disease[]>([]);
  hasChild = (_: number, node: DiseaseNode) => !!node.childrenCount;
  childrenAccessor = (node: DiseaseNode) => node.children ?? [];

  leafExpand = output<DiseaseNode>();

  loaded = false;

  private _transformer = (node: DiseaseNode, level: number) => {
    const flatNode = new FlatDiseaseNode(node);
    flatNode.expandable =
      (node.children && node.children.length > 0) ||
      !!(node.childrenCount && node.childrenCount > 0);
    flatNode.level = level;
    return flatNode;
  };

  treeControl = new FlatTreeControl<FlatDiseaseNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = computed(() => {
    const dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    dataSource.data = this.data().map((disease) => {
      const node = disease as Partial<DiseaseNode>;
      const flatNode = new FlatDiseaseNode(node);
      flatNode.expandable =
        (node.children && node.children.length > 0) ||
        !!(node.childrenCount && node.childrenCount > 0);
      //todo: fix this
      flatNode.level = 1;
      return flatNode;
    });

    this.treeControl.expansionModel.selected.forEach((node) => {
      const n = this.treeControl.dataNodes.find(
        (d) => d.gardId === node.gardId
      );
      if (n) {
        this.treeControl.expand(n);
        this.changeRef.markForCheck();
      }
    });

    return dataSource;
  });

  selectDisease(event: FlatDiseaseNode): void {
    this.loaded = false;
    this.leafExpand.emit(event);
    this.treeControl.toggle(event);
    if (this.treeControl.isExpanded(event)) {
      let r = this.treeControl.expansionModel.selected;
      if (r.length) {
        r = r.filter((node) => !(node.gardId === event.gardId));
        this.treeControl.expansionModel.clear();
        this.treeControl.expansionModel.select(...r);
      }
    } else {
      this.treeControl.expand(event);
    }
    this.loaded = true;
    this.changeRef.detectChanges();
  }
}
