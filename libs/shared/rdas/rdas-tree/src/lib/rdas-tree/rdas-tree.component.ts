import { FlatTreeControl } from '@angular/cdk/tree';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
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
import { DiseaseNode } from '@ncats-frontend-library/models/rdas';
import { LoadingSpinnerComponent } from '@ncats-frontend-library/shared/utils/loading-spinner';

import { BehaviorSubject } from 'rxjs';

export class FlatDiseaseNode extends DiseaseNode {
  level!: number;
  expandable!: boolean;
}

@Component({
  selector: 'ncats-frontend-library-rdas-tree',
  standalone: true,
  imports: [
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './rdas-tree.component.html',
  styleUrls: ['./rdas-tree.component.scss'],
})

//todo refactor tu use signals
export class RdasTreeComponent implements OnInit {
  protected _data = new BehaviorSubject<DiseaseNode[]>([]);

  @Input()
  set data(value: DiseaseNode[]) {
    this._data.next(value);
  }

  get data(): DiseaseNode[] {
    return this._data.getValue();
  }

  @Output()
  leafExpand: EventEmitter<DiseaseNode> = new EventEmitter<DiseaseNode>();

  treeControl;
  treeFlattener;
  dataSource;

  loaded = false;

  private _transformer = (node: DiseaseNode, level: number) => {
    const flatNode = new FlatDiseaseNode(node);
    flatNode.expandable =
      (node.children && node.children.length > 0) ||
      !!(node.childrenCount && node.childrenCount > 0);
    flatNode.level = level;
    return flatNode;
  };

  constructor(
    private changeRef: ChangeDetectorRef,
    private router: Router,
  ) {
    this.treeControl = new FlatTreeControl<FlatDiseaseNode>(
      (node) => node.level,
      (node) => node.expandable,
    );

    this.treeFlattener = new MatTreeFlattener(
      this._transformer,
      (node) => node.level,
      (node) => node.expandable,
      (node) => node.children,
    );

    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener,
    );
  }

  ngOnInit() {
    this._data.subscribe((res) => {
      if (res && res.length) {
        this.dataSource.data = res;
        this.treeControl.expansionModel.selected.forEach((node) => {
          const n = this.treeControl.dataNodes.find(
            (d) => d.gardId === node.gardId,
          );
          if (n) {
            this.treeControl.expand(n);
            this.changeRef.markForCheck();
          }
        });
        this.loaded = true;
        this.changeRef.markForCheck();
      }
    });
  }

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

  hasChild = (_: number, node: DiseaseNode) => !!node.childrenCount;
}
