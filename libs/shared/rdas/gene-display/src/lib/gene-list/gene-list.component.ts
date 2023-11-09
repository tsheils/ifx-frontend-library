import {
  AfterViewInit,
  Component,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { GeneAssociation } from '@ncats-frontend-library/models/rdas';
import { SharedUtilsDataNotFoundComponent } from '@ncats-frontend-library/shared/utils/data-not-found';
import { ExternalLinkComponent } from '@ncats-frontend-library/shared/utils/external-link';
import { GeneListCardComponent } from '../gene-list-card/gene-list-card.component';

@Component({
  selector: 'ncats-frontend-library-gene-list',
  standalone: true,
  imports: [
    NgIf,
    MatPaginatorModule,
    NgFor,
    GeneListCardComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    ExternalLinkComponent,
    SharedUtilsDataNotFoundComponent,
  ],
  templateUrl: './gene-list.component.html',
  styleUrls: ['./gene-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GeneListComponent implements AfterViewInit, OnChanges {
  @Input() genes: GeneAssociation[] | undefined = [];
  count = 0;
  dataSource: MatTableDataSource<GeneAssociation> =
    new MatTableDataSource<GeneAssociation>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Input() showTab = true;
  displayColumns = ['Gene', 'Gene Name', 'Association Type', 'Reference'];

  constructor(@Inject(DOCUMENT) protected dom?: Document) {}

  ngAfterViewInit() {
    if (this.genes) {
      this.count = this.genes.length;
      this.dataSource.data = this.genes;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.sortData({ active: 'Association Type', direction: 'asc' });
    }
  }

  sortData(sort: Sort) {
    if (this.genes) {
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

  ngOnChanges(change: SimpleChanges) {
    if (change['genes'] && this.genes) {
      this.count = this.genes.length;
      this.dataSource.data = this.genes;
      this.sortData({ active: 'Association Type', direction: 'asc' });
    }
  }

  downloadData() {
    if (this.genes) {
      this._downloadFile(this._toTSV(this.genes), 'rdas-genes-download.tsv');
    }
  }

  _toTSV(data: GeneAssociation[]): string {
    // grab the column headings (separated by tabs)
    const headings: string = [
      'geneSymbol',
      'associationStatus',
      'associationType',
      'references',
    ].join('\t');

    // iterate over the data
    const rows: string = data
      .reduce(
        (acc, c) => {
          // for each row object get its values and add tabs between them
          // then add them as a new array to the outgoing array

          return acc.concat([c._toString()]);

          // finally joining each row with a line break
        },
        [headings]
      )
      .join('\n');
    return rows;
  }

  _downloadFile(data: any, name: string, type = 'text/tsv') {
    if (this.dom) {
      const file = new Blob([data], { type: type });
      const link = this.dom.createElement('a');
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(file);
        link.setAttribute('href', url);
        link.setAttribute('download', `${name}`);
        link.style.visibility = 'hidden';
        this.dom.body.appendChild(link);
        link.click();
        this.dom.body.removeChild(link);
      }
    }
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
