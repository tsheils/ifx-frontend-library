import { ChangeDetectorRef, Component, Input, ViewChild } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule, Sort } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { Phenotype, PhenotypeAssociation } from "@ncats-frontend-library/models/rdas";
import { ExternalLinkComponent } from "@ncats-frontend-library/shared/utils/external-link";
import { map } from "rxjs";
import { PhenotypeListCardComponent } from "../phenotype-list-card/phenotype-list-card.component";

@Component({
  selector: 'ncats-frontend-library-phenotype-list',
  standalone: true,
  imports: [CommonModule, PhenotypeListCardComponent, MatPaginatorModule, MatIconModule, MatSortModule, MatCardModule, MatTableModule, ExternalLinkComponent],
  templateUrl: './phenotype-list.component.html',
  styleUrls: ['./phenotype-list.component.scss'],
})
export class PhenotypeListComponent {
  @Input() phenotypes!: PhenotypeAssociation[];
  count = 0;
  dataSource: MatTableDataSource<PhenotypeAssociation> = new MatTableDataSource<PhenotypeAssociation>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayColumns = ["Phenotype", "Frequency", "Evidence", "Reference"]


  ngAfterViewInit() {
    this.count = this.phenotypes.length;
    this.dataSource.data = this.phenotypes;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.sortData({active: 'Frequency', direction: 'desc'})
  }

  sortData(sort: Sort) {
    const data = this.phenotypes.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Phenotype':
          return compare(a.phenotype.hpoTerm, b.phenotype.hpoTerm, isAsc);
        case 'Frequency':
          return compare(a.frequencyRank, b.frequencyRank, isAsc);
        case 'Validated':
          return compare(+a.validationStatus, +b.validationStatus, isAsc);
        case 'Evidence':
          return compare(a.evidence.code, b.evidence.code, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}



