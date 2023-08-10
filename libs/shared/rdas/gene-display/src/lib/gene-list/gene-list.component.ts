import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges, OnInit,
  Output,
  ViewChild
} from "@angular/core";
import { CommonModule, NgFor, NgIf } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatPaginator, MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatSort, MatSortModule, Sort } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { Gene, GeneAssociation } from "@ncats-frontend-library/models/rdas";
import { ExternalLinkComponent } from "@ncats-frontend-library/shared/utils/external-link";
import { map } from "rxjs";
import { GeneListCardComponent } from "../gene-list-card/gene-list-card.component";

@Component({
  selector: 'ncats-frontend-library-gene-list',
  standalone: true,
  imports: [NgIf, MatPaginatorModule, NgFor, GeneListCardComponent, MatCardModule, MatTabsModule, MatTableModule, MatSortModule, ExternalLinkComponent],
  templateUrl: './gene-list.component.html',
  styleUrls: ['./gene-list.component.scss'],
})
export class GeneListComponent implements AfterViewInit {
  @Input() genes!: GeneAssociation[];
   count = 0;
  dataSource: MatTableDataSource<GeneAssociation> = new MatTableDataSource<GeneAssociation>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayColumns = ["Gene Symbol", "Gene Name", "Association Type", "Association Status", "Reference"]


  ngAfterViewInit() {
    this.count = this.genes.length;
    this.dataSource.data = this.genes;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.sortData({active: 'Association Type', direction: 'asc'})
  }

  sortData(sort: Sort) {
    const data = this.genes.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Gene Symbol':
          return compare(a.gene.geneSymbol, b.gene.geneSymbol, isAsc);
          case 'Gene Name':
          return compare(a.gene.geneTitle, b.gene.geneTitle, isAsc);
        case 'Association Type':
          return compare(a.associationType, b.associationType, isAsc);
        case 'Association Status':
          return compare(a.associationStatus, b.associationStatus, isAsc);

        default:
          return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

